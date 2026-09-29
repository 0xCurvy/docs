import { readdirSync, readFileSync } from "node:fs";
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
  {
    id: "planner",
    label: "Planner actions",
    description: "Estimate intents, inspect prepared steps, and execute prepared intents.",
  },
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
  {
    id: "views",
    label: "View actions",
    description: "Read portfolio, activity, quotes and in-flight operations as UI-ready views.",
  },
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

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".vitepress" || entry.name === "public") return [];
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
  });
}

function validateStaticSdkImports(): void {
  const moduleSources: Record<string, string> = {
    [packageName]: resolve(sdkSourceRoot, "index.ts"),
    [`${packageName}/actions`]: resolve(sdkSourceRoot, "actions/index.ts"),
    [`${packageName}/config`]: resolve(sdkSourceRoot, "config/index.ts"),
    [`${packageName}/utils`]: resolve(sdkSourceRoot, "public/utils.ts"),
    [`${packageName}/vite`]: resolve(sdkSourceRoot, "vite.ts"),
  };
  const exportedNames = new Map(
    Object.entries(moduleSources).map(([specifier, path]) => [
      specifier,
      new Set(moduleExports(path).map((symbol) => symbol.name)),
    ]),
  );
  const docsRoot = resolve(currentDirectory, "..");
  const importPattern = /import\s+(?:type\s+)?\{([\s\S]*?)\}\s+from\s+["']([^"']+)["']/g;

  for (const path of markdownFiles(docsRoot)) {
    const markdown = readFileSync(path, "utf8");
    for (const match of markdown.matchAll(importPattern)) {
      const names = exportedNames.get(match[2]);
      if (!names) continue;
      for (const imported of match[1].split(",")) {
        const name = imported
          .trim()
          .replace(/^type\s+/, "")
          .split(/\s+as\s+/)[0];
        if (name && !names.has(name)) {
          throw new Error(
            `Documentation imports non-public symbol "${name}" from "${match[2]}" in ${relative(docsRoot, path)}.`,
          );
        }
      }
    }
  }
}

validateStaticSdkImports();

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
    .replace(/\{@link\s+([^}\s]+)(?:\s+([^}]*?))?\s*\}/g, (_match, target: string, label?: string) => {
      return `\`${label?.trim() || target}\``;
    })
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
    .map((tag) => {
      const value = cleanDocumentation(displayParts(tag.text));
      return name === "throws" ? value.replace(/^\{([^}]+)\}\s*/, "`$1` ") : value;
    })
    .filter(Boolean);
}

function plainSummary(value: string, fallback: string): string {
  const paragraph = value.split(/\n\s*\n/)[0] || fallback;
  const cleaned = paragraph
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/\s*\((?:functional\s+)?port of [^)]+\)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? cleaned;
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
    if (symbol.name !== "parameters" && symbol.name !== "params" && symbol.name !== "options") return parameter;

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

export const configFunctionNames = moduleExports(resolve(sdkSourceRoot, "config/index.ts"))
  .map(targetSymbol)
  .filter((symbol) => Boolean(symbol.flags & ts.SymbolFlags.Value))
  .filter((symbol) => {
    const declaration = declarationFor(symbol);
    return declaration && checker.getTypeOfSymbolAtLocation(symbol, declaration).getCallSignatures().length > 0;
  })
  .map((symbol) => symbol.name)
  .sort();

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

const referenceRoutes: Record<string, string> = {
  CurvyConfig: "/sdk/config/",
  acceptsPortalShield: "/sdk/config/acceptsPortalShield",
  createBrowserCurvyConfig: "/sdk/config/createBrowserCurvyConfig",
  createCurvyConfig: "/sdk/config/createCurvyConfig",
  createServerCurvyConfig: "/sdk/config/createServerCurvyConfig",
  destroyConfig: "/sdk/config/destroyConfig",
  getActiveNetworks: "/sdk/config/getActiveNetworks",
  getDefaultAggregatorNetwork: "/sdk/config/getDefaultAggregatorNetwork",
  getCurvyConfig: "/sdk/config/getCurvyConfig",
  getEnvironment: "/sdk/config/getEnvironment",
  getProtocol: "/sdk/config/getProtocol",
  peekCurvyConfig: "/sdk/config/peekCurvyConfig",
  setCurvyConfig: "/sdk/config/setCurvyConfig",
};

function linkReferences(value: string, currentAction: string): string {
  return value.replace(/`([A-Za-z_$][\w$]*)`/g, (match, name: string) => {
    const action = actionByName.get(name);
    if (action && action.name !== currentAction) {
      return `[\`${name}\`](/sdk/actions/${action.category}/${action.name})`;
    }
    const route = referenceRoutes[name];
    return route ? `[\`${name}\`](${route})` : match;
  });
}

const actionFamilies = [
  ["addAccount", "addPartialAccount", "removeAccount", "setActiveAccount"],
  ["getAccounts", "getAccountById", "getActiveAccount", "hasAccount", "hasActiveAccount"],
  ["getBabyJubjubPublicKey", "signMessageWithBabyJubjub"],
  ["watchAccounts", "watchActiveAccount"],
  ["register", "registerWithPasskey", "registerWithPrivateKeys"],
  ["login", "loginWithPasskey", "loginWithPrivateKeys", "logout", "restoreSession"],
  ["getBalances", "refreshBalances", "getScanProgress", "pauseBalanceRefresh", "resumeBalanceRefresh"],
  ["getNetworks", "getNetwork", "switchNetworkEnvironment", "watchEnvironment", "ensResolveCurvyId"],
  ["on", "off"],
  ["estimateIntent", "executeIntent", "getPlanSteps", "estimateExternalTransfer", "estimateBridge"],
  ["aggregate", "withdraw", "estimateAggregationCosts"],
  ["buildAggregateRequest", "proveAggregation", "submitToChain", "relaySubmission", "waitForRelay"],
  ["buildWithdrawRequest", "proveWithdrawal", "submitToChain", "relaySubmission", "waitForRelay"],
  ["generateEntryPortal", "generateExitPortal", "getPortalRecords", "getPortalStatus"],
  ["findOwnedPortals", "findPortal", "recoverPortal"],
  ["syncNotes", "getSpendWitnesses", "resolveNoteWitness", "refreshBalances"],
  ["getTransactionHistory", "executeIntent"],
  ["resetStorage", "refreshBalances"],
];

for (const name of new Set(actionFamilies.flat())) {
  if (!actionByName.has(name)) throw new Error(`Related SDK action "${name}" is not a public action export.`);
}

const categoryGuides: Record<string, { label: string; path: string }> = {
  account: { label: "Authentication guide", path: "/for-programmers/authentication" },
  auth: { label: "Authentication guide", path: "/for-programmers/authentication" },
  balances: { label: "Querying balances guide", path: "/for-programmers/querying-balances" },
  notes: { label: "Querying balances guide", path: "/for-programmers/querying-balances" },
  history: { label: "Interacting with assets guide", path: "/for-programmers/interacting-with-assets" },
  planner: { label: "Interacting with assets guide", path: "/for-programmers/interacting-with-assets" },
  aggregator: { label: "Interacting with assets guide", path: "/for-programmers/interacting-with-assets" },
  bridge: { label: "Interacting with assets guide", path: "/for-programmers/interacting-with-assets" },
  proving: { label: "Interacting with assets guide", path: "/for-programmers/interacting-with-assets" },
  portals: { label: "Portals and recovery guide", path: "/for-programmers/portals-and-recovery" },
  recovery: { label: "Portals and recovery guide", path: "/for-programmers/portals-and-recovery" },
  events: { label: "Listening to events guide", path: "/for-programmers/listening-to-events" },
  networks: { label: "Config guide", path: "/sdk/config/" },
  storage: { label: "Config guide", path: "/sdk/config/" },
  views: { label: "Interacting with assets guide", path: "/for-programmers/interacting-with-assets" },
};

function relatedActions(action: ActionReference): ActionReference[] {
  const names = new Set(
    actionFamilies
      .filter((family) => family.includes(action.name))
      .flatMap((family) => family.filter((name) => name !== action.name)),
  );
  return [...names]
    .map((name) => actionByName.get(name))
    .filter((related): related is ActionReference => Boolean(related))
    .slice(0, 5);
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

const parameterExampleValues: Record<string, string> = {
  cached: "cached: false",
  direction: 'direction: "newer"',
  inputFinalityPolicy: 'inputFinalityPolicy: "finalized"',
  silent: "silent: true",
  waitFor: 'waitFor: "finalized"',
};

function propertyExample(parameter: ReferenceParameter, focused: boolean): string {
  const value = parameterExampleValues[parameter.name] ?? parameter.name;
  return `${value},${focused ? " // [!code focus]" : ""}`;
}

function callPrefix(action: ActionReference): string {
  const asynchronous = action.returnType.startsWith("Promise<");
  const returnsVoid = action.returnType === "void" || action.returnType === "Promise<void>";
  return `${returnsVoid ? "" : "const result = "}${asynchronous ? "await " : ""}${action.name}`;
}

function parameterExample(action: ActionReference, parameter: ReferenceParameter, parent?: ReferenceParameter): string {
  if (action.parameters.length === 1 && parent === action.parameters[0]) {
    const properties = parent.properties ?? [];
    const included = properties.filter((property) => !property.optional || property.name === parameter.name);
    return [
      `${callPrefix(action)}({`,
      ...included.map((property) => `  ${propertyExample(property, property.name === parameter.name)}`),
      "});",
    ].join("\n");
  }

  const lines = [`${callPrefix(action)}(`];
  for (const argument of action.parameters) {
    if (argument.properties) {
      if (argument === parameter) {
        lines.push(
          `  { // [!code focus:${Math.max(1, (argument.properties?.filter((item) => !item.optional).length ?? 0) + 2)}]`,
        );
        for (const property of argument.properties.filter((item) => !item.optional)) {
          lines.push(`    ${propertyExample(property, false)}`);
        }
        lines.push("  },");
      } else if (argument === parent) {
        const included = argument.properties.filter(
          (property) => !property.optional || property.name === parameter.name,
        );
        lines.push("  {");
        for (const property of included) {
          lines.push(`    ${propertyExample(property, property.name === parameter.name)}`);
        }
        lines.push("  },");
      } else if (!argument.optional) {
        lines.push(`  ${argument.name},`);
      }
    } else if (!argument.optional || argument === parameter) {
      lines.push(`  ${argument.name},${argument === parameter ? " // [!code focus]" : ""}`);
    }
  }
  lines.push(");");
  return lines.join("\n");
}

const parameterDescriptionOverrides: Record<string, string> = {
  "addAccount.account": "The complete Curvy account to add to the runtime stores and make active.",
  "addAccount.skipBearerTokenUpdate": "Whether to leave the current bearer token unchanged while adding the account.",
  "addPartialAccount.keyPairs": "The available subset of Curvy key pairs for the partial account.",
  "getAccountById.id": "The deterministic account identifier to look up.",
  "getBabyJubjubPublicKey.accountId":
    "The account whose Baby Jubjub public key should be returned. Defaults to the active account.",
  "hasAccount.id": "The deterministic account identifier to test.",
  "removeAccount.accountId": "The account to remove from runtime state and persistent storage.",
  "setActiveAccount.accountId": "The account to make active.",
  "setActiveAccount.skipBearerTokenUpdate":
    "Whether to skip bearer-token refresh when activating a registered account.",
  "signMessageWithBabyJubjub.message": "The message bytes to sign.",
  "signMessageWithBabyJubjub.accountId": "The signing account. Defaults to the active account.",
  "estimateAggregationCosts.networkSlug": "The aggregator network whose proving and relay costs should be estimated.",
  "relaySubmission.intentId":
    "An optional stable intent identifier used to recover the submission after an uncertain relay response.",
  "login.signature": "The EVM authentication signature and its signing address.",
  "loginWithPasskey.prfValue": "The passkey PRF output used to derive the account's Curvy keys.",
  "loginWithPasskey.credId": "The WebAuthn credential identifier associated with the passkey.",
  "loginWithPrivateKeys.s": "The lowercase Curvy spending private key.",
  "loginWithPrivateKeys.v": "The lowercase Curvy viewing private key.",
  "loginWithPrivateKeys.requestingAddress": "The wallet address requesting access to the registered account.",
  "loginWithPrivateKeys.credId": "An optional WebAuthn credential identifier to associate with the session.",
  "logout.accountId": "The account whose authenticated session should be ended. Defaults to the active account.",
  "register.handle": "The Curvy handle to register.",
  "register.signature": "The EVM registration signature and its signing address.",
  "registerWithPasskey.handle": "The Curvy handle to register.",
  "registerWithPasskey.prfValue": "The passkey PRF output used to derive the new account's Curvy keys.",
  "registerWithPasskey.credId": "The WebAuthn credential identifier associated with the passkey.",
  "registerWithPrivateKeys.s": "The lowercase Curvy spending private key.",
  "registerWithPrivateKeys.v": "The lowercase Curvy viewing private key.",
  "registerWithPrivateKeys.handle": "The Curvy handle to register.",
  "registerWithPrivateKeys.userAddress": "The wallet address that will own the registered handle.",
  "pauseBalanceRefresh.accountId":
    "The account whose balance-refresh lock should be paused. Defaults to the active account.",
  "refreshBalances.signal": "An abort signal used to cancel the refresh between network and paging operations.",
  "refreshBalances.silent": "Whether to suppress balance-refresh lifecycle events for this refresh.",
  "refreshBalances.accountId":
    "The account whose shielded balances should be refreshed. Defaults to the active account.",
  "resumeBalanceRefresh.accountId":
    "The account whose balance-refresh lock should be resumed. Defaults to the active account.",
  "estimateBridge.fromChainId": "The source chain identifier.",
  "estimateBridge.toChainId": "The destination chain identifier.",
  "estimateBridge.fromToken": "The source token address.",
  "estimateBridge.toToken": "The destination token address.",
  "off.eventName": "The Curvy event from which to remove the listener.",
  "off.listener": "The listener previously passed to `on`.",
  "on.eventName": "The Curvy event to subscribe to.",
  "on.listener": "The callback invoked when the event is emitted.",
  "on.options": "Optional subscription configuration and lifecycle controls.",
  "getTransactionHistory.accountId":
    "The account whose transaction records should be returned. Defaults to the active account.",
  "getTransactionHistory.networkSlug": "Limit results to this network slug.",
  "getTransactionHistory.limit": "The maximum number of transaction records to return.",
  "getSpendWitnesses.networkSlug": "The network whose notes tree should supply the spend witnesses.",
  "resolveNoteWitness.networkSlug": "The network whose notes tree contains the commitment.",
  "resolveNoteWitness.signal": "An abort signal used to cancel note synchronization while resolving the witness.",
  "resolveNoteWitness.viewingKey": "The viewing private key used for local note ownership discovery.",
  "syncNotes.shardHeight": "Override the sharded notes-tree height for this synchronization pass.",
  "syncNotes.pageSize": "Override the number of indexed leaves requested per page.",
  "syncNotes.verifier": "Override the component that verifies the assembled notes root against the chain.",
  "syncNotes.resolveOwnership": "Override the local note-ownership resolver.",
  "estimateExternalTransfer.fromNetwork": "The public network from which funds enter the transfer.",
  "estimateExternalTransfer.fromCurrency": "The source currency.",
  "estimateExternalTransfer.fromAmount": "The gross source amount in the source currency's base units.",
  "estimateExternalTransfer.toNetwork": "The public network on which the recipient receives funds.",
  "estimateExternalTransfer.toCurrency": "The currency the recipient receives.",
  "estimateIntent.intent": "The transfer intent to plan and estimate.",
  "executeIntent.prepared": "The in-memory prepared handle returned by estimateIntent.",
  "getPlanSteps.plan": "A plan whose sanitized command and wait metadata should be returned.",
  "generateEntryPortal.curvyId": "The Curvy handle whose keys should own the portal.",
  "generateEntryPortal.publicKeys": "Explicit public keys to use instead of resolving a Curvy handle.",
  "generateEntryPortal.coinType": "An optional coin-type selector for the portal's network flavour.",
  "generateEntryPortal.currencyId": "An optional Curvy currency identifier for the deposited asset.",
  "generateExitPortal.curvyId": "The Curvy handle whose keys should own the portal.",
  "generateExitPortal.publicKeys": "Explicit public keys to use instead of resolving a Curvy handle.",
  "generateExitPortal.currencyId": "The Curvy currency identifier for the asset being withdrawn.",
  "generateExitPortal.exitAddress": "The public destination address that receives the withdrawn funds.",
  "generateExitPortal.coinType": "An optional coin-type selector for the portal's network flavour.",
  "generateExitPortal.exitNetworkId": "The optional destination network identifier.",
  "generateExitPortal.exitCurrencyId": "The optional destination currency identifier used by an exit bridge.",
  "getPortalRecords.startTime": "Include records created at or after this Unix timestamp.",
  "getPortalRecords.endTime": "Include records created at or before this Unix timestamp.",
  "findOwnedPortals.network": "The network on which to discover portals owned by the active account.",
  "findPortal.address": "The on-chain portal address to match.",
  "findPortal.network": "The network on which the portal address exists.",
  "recoverPortal.networkId": "The Curvy network identifier on which the portal holds funds.",
  "recoverPortal.tokenAddress": "The EVM token contract or Solana mint held by the portal.",
  "recoverPortal.portalRecord": "The matched portal record containing the recovery announcement.",
  "recoverPortal.destinationAddress": "The public address that should receive the recovered funds.",
  "recoverPortal.solanaSigner": "The connected signer required to submit a Solana recovery transaction.",
  // Added 2026-09-29 for the SDK actions merged from develop (views, planner, recovery, auth, account).
  "authenticateAccount.action": 'Whether to `"login"` to an existing account or `"register"` a new one.',
  "authenticateAccount.credential":
    'The credential kind the remaining parameters describe: `"signature"`, `"privateKeys"` or `"passkey"`.',
  "dismissOperation.accountId": "The account that owns the operation. Defaults to the active account.",
  "dismissOperation.operationId": "The operation whose transfer notice should be hidden.",
  "estimateExternalTransfer.signal": "Aborts the estimate; an aborted estimate is never published.",
  "estimatePortalDeposit.amount": "The gross deposit amount in the vault token's base units.",
  "estimatePortalDeposit.networkSlug": "The network whose vault fees should be applied, by slug.",
  "estimatePortalDeposit.signal": "Aborts the fee reads.",
  "estimatePortalDeposit.token": "The vault token id of the deposited currency.",
  "estimatePortalEntry.amount": "The deposited amount in the currency's base units.",
  "estimatePortalEntry.currency": "The currency the deposit is sent in on `network`.",
  "estimatePortalEntry.signal": "Aborts the route and fee reads.",
  "estimatePortalRecovery.destinationAddress": "The address the recovered assets are sent to.",
  "estimatePortalRecovery.networkId": "The EVM network the portal lives on, by network id.",
  "estimatePortalRecovery.tokenAddress": "The token contract the portal holds and the recovery moves.",
  "exportActivity.accountId": "The account whose activity is exported. Defaults to the active account.",
  "exportActivity.batchSize": "How many rich history rows are hydrated at a time. Defaults to 100.",
  "exportActivity.filters": "Restrict the export by free-text query, kinds, network slug or vault token id.",
  "exportActivity.format": 'The output format, `"csv"` or `"json"`.',
  "exportActivity.signal": "Aborts the export before later batches are hydrated.",
  "getAccountProfile.accountId": "The account whose profile snapshot is returned. Defaults to the active account.",
  "getAccountProfiles.includeTemporary":
    "Whether to include temporary swap and recovery identities alongside registered accounts.",
  "getActivityPage.accountId": "The account whose history is paged. Defaults to the active account.",
  "getActivityPage.cursor":
    "A cursor from a previous page. Reusing a page's own `cursor` refreshes statuses without changing membership.",
  "getActivityPage.filters": "Restrict the page by free-text query, kinds, network slug or vault token id.",
  "getActivityPage.pageSize": "The number of items per page.",
  "getActivityPage.signal": "Aborts the read.",
  "getAssetOptions.accountId": "The account whose balances decide which options are selectable. Defaults to the active account.",
  "getAssetOptions.inputFinalityPolicy": "Which balance buckets count as spendable when evaluating private inputs.",
  "getAssetOptions.metadataMaxAgeMs": "How old registry metadata may be before it is refreshed. Defaults to thirty minutes.",
  "getAssetOptions.networkSlug": "Only return options on this network.",
  "getAssetOptions.priceMaxAgeMs": "How old prices may be before they are refreshed. Defaults to five minutes.",
  "getAssetOptions.purpose":
    'What the picker selects: `"private-input"`, `"public-input"` or `"public-output"`. Decides which reasons make an option unavailable.',
  "getAssetOptions.query": "A free-text filter on asset names and symbols.",
  "getAssetOptions.signal": "Aborts the read.",
  "getOperationRecovery.accountId": "The account that owns the operation. Defaults to the active account.",
  "getOperationRecovery.operationId": "The swap operation whose stopped portals are located.",
  "getOperationRecovery.signal": "Aborts the portal lookup.",
  "getOperations.accountId": "The account whose operations are reconstructed. Defaults to the active account.",
  "getPortalDeposit.accountId": "The account that owns the portal. Defaults to the active account.",
  "getPortalDeposit.signal": "Aborts the read.",
  "getPortfolio.accountId": "The account whose portfolio is built. Defaults to the active account.",
  "getPortfolio.balanceMaxAgeMs": "How old balance data may be before it is refreshed.",
  "getPortfolio.inputFinalityPolicy": "Which balance buckets count as spendable.",
  "getPortfolio.signal": "Aborts the read.",
  "getQuote.intent": "The transfer intent to estimate for the review screen.",
  "getScanProgress.accountId": "The account whose scan progress is read. Defaults to the active account.",
  "getTransactionHistory.signal": "Aborts the history read.",
  "iterateActivity.accountId": "The account whose activity is iterated. Defaults to the active account.",
  "iterateActivity.filters": "Restrict the iteration by free-text query, kinds, network slug or vault token id.",
  "iterateActivity.signal": "Aborts the iteration before later batches are hydrated.",
  "markActivitySeen.accountId": "The account whose activity is acknowledged. Defaults to the active account.",
  "markActivitySeen.ids": "The activity entries to acknowledge explicitly. Mutually exclusive with `watermark`.",
  "markActivitySeen.watermark":
    "A `watermark` captured from an activity page; acknowledges everything present when that page was created. Mutually exclusive with `ids`.",
  "reconcileOperation.accountId": "The account that owns the operation. Defaults to the active account.",
  "reconcileOperation.operationId": "The interrupted operation whose chain evidence is rechecked.",
  "reconcileOperation.signal": "Aborts the chain reads.",
  "resetStorage.signal": "Aborts the rebuild after the cache has been cleared.",
  "restoreSession.accounts":
    "Host-supplied accounts (`id`, `s`, `v`) to restore. When omitted, accounts come from the session keystore.",
  "reviewForResume.accountId": "The account that owns the operation. Defaults to the active account.",
  "reviewForResume.operationId": "The interrupted operation to inspect.",
  "watchOperations.accountId": "The account whose operations are watched. Defaults to the active account.",
  "watchOperations.onChange": "Called immediately and on every change with the current operation snapshots.",
  "watchOperations.onError": "Called when a background read fails.",
  "watchOperations.signal": "Stops the subscription; the returned function does the same.",
};

function parameterDescription(action: ActionReference, parameter: ReferenceParameter, heading: string): string {
  const description = parameter.description || parameterDescriptionOverrides[`${action.name}.${heading}`];
  if (!description) {
    throw new Error(`Missing SDK reference description for ${action.name}.${heading}`);
  }
  return linkReferences(description, action.name);
}

function renderParameter(
  action: ActionReference,
  parameter: ReferenceParameter,
  heading: string,
  parent?: ReferenceParameter,
): string {
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
    parameterDescription(action, parameter, heading),
    "",
    "```ts",
    parameterExample(action, parameter, parent),
    "```",
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
    if ((parameter.name === "parameters" || parameter.name === "params") && parameter.properties) {
      return parameter.properties.map((property) => renderParameter(action, property, property.name, parameter));
    }
    return [
      renderParameter(action, parameter, parameter.name),
      ...(parameter.properties ?? []).map((property) =>
        renderParameter(action, property, `${parameter.name}.${property.name}`, parameter),
      ),
    ];
  });
  const related = relatedActions(action);
  const guide = categoryGuides[action.category];

  return [
    `# ${action.name}`,
    "",
    linkReferences(action.description, action.name),
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
    linkReferences(
      action.returnsDescription ?? "The action resolves or returns the value shown in the signature.",
      action.name,
    ),
    "",
    "## Parameters",
    "",
    ...(parameters.length > 0 ? parameters : ["This action takes no parameters.", ""]),
    "## Errors",
    "",
    ...(action.throws.length > 0
      ? action.throws.map((error) => `- ${linkReferences(error, action.name)}`)
      : ["Errors from config resolution and the underlying SDK operation are propagated to the caller."]),
    "",
    "## Related",
    "",
    ...(guide ? [`- [${guide.label}](${guide.path})`] : []),
    ...related.map(
      (relatedAction) =>
        `- [\`${relatedAction.name}\`](/sdk/actions/${relatedAction.category}/${relatedAction.name}) — ${relatedAction.summary}`,
    ),
    ...(guide || related.length > 0 ? [] : ["- [Browse all public actions](/sdk/actions/)"]),
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
