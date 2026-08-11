import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const sdkRoot = resolve(currentDirectory, "../../../@0xcurvy/sdk");
const repositoryRoot = resolve(sdkRoot, "../../..");
const sdkSourceRoot = resolve(sdkRoot, "src");
const packageName = "@0xcurvy/curvy-sdk";
const sourceBaseUrl = "https://github.com/0xCurvy/curvy-monorepo/blob/main";
const typeFormatFlags = ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope;

type ReferenceParameter = {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
  description: string;
  properties?: ReferenceParameter[];
};

export type ActionReference = {
  category: string;
  name: string;
  description: string;
  summary: string;
  examples: string[];
  throws: string[];
  returnsDescription?: string;
  returnType: string;
  signature: string;
  parameters: ReferenceParameter[];
  importPath: string;
  relativePath: string;
  sourcePath: string;
  sourceUrl: string;
};

export type ActionGroup = {
  id: string;
  label: string;
  description: string;
  actions: ActionReference[];
};

type GeneratedReferencePage = {
  title: string;
  description: string;
  relativePath: string;
  markdown: string;
};

const groupMetadata: Array<Omit<ActionGroup, "actions">> = [
  {
    id: "account",
    label: "Account actions",
    description: "Manage runtime accounts, active-account state, keys, and subscriptions.",
  },
  {
    id: "auth",
    label: "Authentication actions",
    description: "Register, log in, restore, and log out Curvy accounts.",
  },
  {
    id: "balances",
    label: "Balance actions",
    description: "Read projected balances and control note synchronization.",
  },
  {
    id: "networks",
    label: "Network actions",
    description: "Read networks, switch environments, and resolve Curvy IDs.",
  },
  { id: "events", label: "Event actions", description: "Subscribe and unsubscribe from typed SDK lifecycle events." },
  { id: "history", label: "History actions", description: "Read user-facing transaction and intent history." },
  { id: "planner", label: "Planner actions", description: "Estimate intents and execute or walk plan trees." },
  {
    id: "aggregator",
    label: "Aggregator actions",
    description: "Build, submit, relay, and price aggregation and withdrawal proofs.",
  },
  { id: "bridge", label: "Bridge actions", description: "Estimate cross-chain bridge routes." },
  { id: "portals", label: "Portal actions", description: "Generate and inspect entry and exit Portals." },
  { id: "recovery", label: "Recovery actions", description: "Find owned Portals and recover their assets." },
  { id: "notes", label: "Note actions", description: "Synchronize notes and resolve spend witnesses." },
  { id: "proving", label: "Proving actions", description: "Generate aggregation and withdrawal proofs." },
  { id: "storage", label: "Storage actions", description: "Reset and reconstruct SDK-derived storage." },
];

const configPath = resolve(sdkRoot, "tsconfig.json");
const rawConfig = ts.readConfigFile(configPath, ts.sys.readFile);
if (rawConfig.error) throw new Error(ts.flattenDiagnosticMessageText(rawConfig.error.messageText, "\n"));
const parsedConfig = ts.parseJsonConfigFileContent(rawConfig.config, ts.sys, sdkRoot);
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const checker = program.getTypeChecker();

function sourceFile(path: string): ts.SourceFile {
  const file = program.getSourceFile(path);
  if (!file) throw new Error(`SDK reference source not found: ${path}`);
  return file;
}

function moduleExports(path: string): ts.Symbol[] {
  const file = sourceFile(path);
  const module = checker.getSymbolAtLocation(file);
  if (!module) throw new Error(`SDK reference module has no symbol: ${path}`);
  return checker.getExportsOfModule(module);
}

function targetSymbol(symbol: ts.Symbol): ts.Symbol {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function declarationFor(symbol: ts.Symbol): ts.Declaration | undefined {
  return symbol.valueDeclaration ?? symbol.declarations?.[0];
}

function displayParts(parts: ts.SymbolDisplayPart[] | string | undefined): string {
  return typeof parts === "string" ? parts : ts.displayPartsToString(parts);
}

function cleanDocumentation(value: string): string {
  return value
    .replace(/\{@link\s+([^}\s]+)(?:\s+([^}]+))?\}/g, (_match, target: string, label?: string) => label ?? target)
    .replace(/\r\n/g, "\n")
    .trim();
}

function documentation(symbol: ts.Symbol): string {
  return cleanDocumentation(ts.displayPartsToString(symbol.getDocumentationComment(checker)));
}

function tagValues(symbol: ts.Symbol, name: string): string[] {
  return symbol
    .getJsDocTags(checker)
    .filter((tag) => tag.name === name)
    .map((tag) => cleanDocumentation(displayParts(tag.text)))
    .filter(Boolean);
}

function plainSummary(value: string, fallback: string): string {
  const paragraph = value.split(/\n\s*\n/)[0] || fallback;
  return paragraph
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function typeString(type: ts.Type, location: ts.Node): string {
  return checker.typeToString(type, location, typeFormatFlags);
}

function parameterReference(symbol: ts.Symbol, fallbackLocation: ts.Node): ReferenceParameter {
  const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0] ?? fallbackLocation;
  const optional =
    Boolean(symbol.flags & ts.SymbolFlags.Optional) ||
    (ts.isParameter(declaration) && Boolean(declaration.questionToken || declaration.initializer));
  const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const description =
    documentation(symbol) || (symbol.name === "config" ? "Curvy config to use. Defaults to the ambient config." : "");
  const declaredType =
    symbol.declarations?.length === 1 &&
    (ts.isParameter(declaration) || ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration))
      ? declaration.type
      : undefined;

  return {
    name: symbol.name,
    type: declaredType ? declaredType.getText() : typeString(type, declaration),
    optional,
    defaultValue:
      ts.isParameter(declaration) && declaration.initializer ? declaration.initializer.getText() : undefined,
    description,
  };
}

function actionParameters(signature: ts.Signature, declaration: ts.Declaration): ReferenceParameter[] {
  return signature.parameters.map((symbol) => {
    const parameter = parameterReference(symbol, declaration);
    if (symbol.name !== "parameters" && symbol.name !== "options") return parameter;

    const parameterDeclaration = symbol.valueDeclaration ?? symbol.declarations?.[0] ?? declaration;
    const parameterType = checker.getTypeOfSymbolAtLocation(symbol, parameterDeclaration);
    const properties = checker
      .getPropertiesOfType(parameterType)
      .filter((property) => !property.name.startsWith("__"))
      .map((property) => parameterReference(property, parameterDeclaration));

    return properties.length > 0 ? { ...parameter, properties } : parameter;
  });
}

function sourceDetails(declaration: ts.Declaration): { sourcePath: string; sourceUrl: string } {
  const sourcePath = relative(repositoryRoot, declaration.getSourceFile().fileName).replaceAll("\\", "/");
  return { sourcePath, sourceUrl: `${sourceBaseUrl}/${sourcePath}` };
}

const actionExampleOverrides: Record<string, string[]> = {
  estimateAggregationCosts: [
    `const costs = await estimateAggregationCosts({
  config,
  networkSlug: network.slug,
  token: inputNotes[0].token,
  spentToOthers,
});`,
  ],
  getSpendWitnesses: [
    `const supplied = await getSpendWitnesses({
  networkSlug,
  noteIds,
  config,
});`,
  ],
  getTransactionHistory: [
    `const history = await getTransactionHistory({
  accountId,
  networkSlug,
  config,
});`,
  ],
  relaySubmission: [
    `const queued = await relaySubmission({ request, intentId, config });
const final = await waitForRelay({ requestId: queued.requestId, config });`,
  ],
  resolveNoteWitness: [
    `const witness = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  noteId,
  config,
});`,
  ],
  submitToChain: ["const result = await submitToChain({ request, walletClient, config });"],
  syncNotes: ["const results = await syncNotes({ accountId, config });"],
  waitForRelay: [
    `const result = await waitForRelay({
  requestId,
  waitFor: "finalized",
  config,
});`,
  ],
};

function createActionReferences(): ActionReference[] {
  const actionIndex = resolve(sdkSourceRoot, "actions/index.ts");
  return moduleExports(actionIndex)
    .map((exportedSymbol) => ({ exportedSymbol, symbol: targetSymbol(exportedSymbol) }))
    .filter(({ symbol }) => Boolean(symbol.flags & ts.SymbolFlags.Value))
    .map(({ exportedSymbol, symbol }): ActionReference | undefined => {
      const declaration = declarationFor(symbol);
      if (!declaration) return undefined;

      const match = declaration
        .getSourceFile()
        .fileName.replaceAll("\\", "/")
        .match(/\/actions\/([^/]+)\//);
      if (!match) return undefined;
      const category = match[1];
      const signatures = checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures();
      const signature = signatures[0];
      if (!signature) return undefined;

      const description = documentation(symbol) || `Public ${exportedSymbol.name} SDK action.`;
      const signatureText = checker.signatureToString(signature, declaration, typeFormatFlags, ts.SignatureKind.Call);
      const { sourcePath, sourceUrl } = sourceDetails(declaration);

      return {
        category,
        name: exportedSymbol.name,
        description,
        summary: plainSummary(description, `${exportedSymbol.name} SDK action.`),
        examples: actionExampleOverrides[exportedSymbol.name] ?? tagValues(symbol, "example"),
        throws: tagValues(symbol, "throws"),
        returnsDescription: tagValues(symbol, "returns")[0] ?? tagValues(symbol, "return")[0],
        returnType: typeString(signature.getReturnType(), declaration),
        signature: `function ${exportedSymbol.name}${signatureText}`,
        parameters: actionParameters(signature, declaration),
        importPath: `${packageName}/actions`,
        relativePath: `sdk/actions/${category}/${exportedSymbol.name}.md`,
        sourcePath,
        sourceUrl,
      } satisfies ActionReference;
    })
    .filter((action): action is ActionReference => Boolean(action));
}

export const actionReferences = createActionReferences();
const actionByName = new Map(actionReferences.map((action) => [action.name, action]));
if (actionByName.size !== actionReferences.length) {
  throw new Error("Public SDK actions must have unique exported names for reference routing.");
}

export const actionGroups: ActionGroup[] = groupMetadata.map((group) => ({
  ...group,
  actions: actionReferences
    .filter((action) => action.category === group.id)
    .sort((a, b) => a.name.localeCompare(b.name)),
}));

const discoveredCategories = new Set(actionReferences.map((action) => action.category));
const configuredCategories = new Set(groupMetadata.map((group) => group.id));
for (const category of discoveredCategories) {
  if (!configuredCategories.has(category)) {
    throw new Error(`Public SDK action category "${category}" is missing from the documentation navigation.`);
  }
}

function cleanExample(example: string): string {
  return example
    .replace(/^```(?:ts|typescript)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function generatedUsage(action: ActionReference): string {
  const declaration = action.parameters;
  let argumentsText = "";

  if (declaration.length === 1 && declaration[0].properties) {
    const properties = declaration[0].properties;
    const fields = properties
      .filter((property) => !property.optional || property.name === "config")
      .map((property) => property.name);
    argumentsText = fields.length > 0 ? `{ ${fields.join(", ")} }` : "";
  } else {
    argumentsText = declaration
      .filter((parameter) => !parameter.optional)
      .map((parameter) => parameter.name)
      .join(", ");
  }

  const asynchronous = action.returnType.startsWith("Promise<");
  const returnsVoid = action.returnType === "void" || action.returnType === "Promise<void>";
  return `${returnsVoid ? "" : "const result = "}${asynchronous ? "await " : ""}${action.name}(${argumentsText});`;
}

function renderParameter(parameter: ReferenceParameter, heading: string): string {
  const metadata = [
    `- **Type:** \`${parameter.type.replaceAll("`", "\\`")}\``,
    `- **Required:** ${parameter.optional ? "no" : "yes"}`,
    ...(parameter.defaultValue ? [`- **Default:** \`${parameter.defaultValue}\``] : []),
  ];
  return [
    `### \`${heading}\``,
    "",
    ...metadata,
    "",
    parameter.description || "See the TypeScript signature for this value's contract.",
    "",
  ].join("\n");
}

export function renderActionPage(action: ActionReference): string {
  const examples = action.examples.length > 0 ? action.examples.map(cleanExample) : [generatedUsage(action)];
  const usage = examples.flatMap((example, index) => [
    ...(examples.length > 1 ? [`### Example ${index + 1}`, ""] : []),
    "```ts",
    example,
    "```",
    "",
  ]);
  const parameters = action.parameters.flatMap((parameter) => {
    if (parameter.name === "parameters" && parameter.properties) {
      return parameter.properties.map((property) => renderParameter(property, property.name));
    }
    return [
      renderParameter(parameter, parameter.name),
      ...(parameter.properties ?? []).map((property) =>
        renderParameter(property, `${parameter.name}.${property.name}`),
      ),
    ];
  });

  return [
    `# ${action.name}`,
    "",
    action.description,
    "",
    "## Import",
    "",
    "```ts",
    `import { ${action.name} } from "${action.importPath}";`,
    "```",
    "",
    "## Usage",
    "",
    ...usage,
    "## Signature",
    "",
    "```ts",
    action.signature,
    "```",
    "",
    "## Returns",
    "",
    `\`${action.returnType.replaceAll("`", "\\`")}\``,
    "",
    action.returnsDescription ?? "The action resolves or returns the value shown in the signature.",
    "",
    "## Parameters",
    "",
    ...(parameters.length > 0 ? parameters : ["This action takes no parameters.", ""]),
    "## Errors",
    "",
    ...(action.throws.length > 0
      ? action.throws.map((error) => `- ${error}`)
      : ["Errors from config resolution and the underlying SDK operation are propagated to the caller."]),
    "",
    "## Source",
    "",
    `[${action.sourcePath}](${action.sourceUrl})`,
    "",
  ].join("\n");
}

export function actionReference(category: string, name: string): ActionReference | undefined {
  return actionReferences.find((action) => action.category === category && action.name === name);
}

export const generatedReferencePages: GeneratedReferencePage[] = [
  ...actionReferences.map((action) => ({
    title: action.name,
    description: action.summary,
    relativePath: action.relativePath,
    markdown: renderActionPage(action),
  })),
];
