import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { type DefaultTheme, defineConfig } from "vitepress";
import {
  actionGroups,
  actionReference,
  configFunctionNames,
  generatedReferencePages,
  renderActionPage,
} from "./sdk-reference.mts";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteOrigin = "https://docs.curvy.box";

const newBadge = '<span class="sidebar-new-badge">New</span>';

const generalSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "Introduction",
    link: "/introduction",
    items: [
      { text: "Frequently asked questions", link: "/faq" },
      { text: "Get involved", link: "/get-involved" },
    ],
  },
  {
    text: `Payments SDK ${newBadge}`,
    link: "/sdk/payments/",
    items: [
      { text: "Receive payments from humans", link: "/sdk/payments/human-checkout" },
      { text: "Receive payments from agents", link: "/sdk/payments/x402" },
      { text: "Getting started", link: "/sdk/payments/getting-started" },
      { text: "Fees and minimums", link: "/sdk/payments/fees" },
    ],
  },
  {
    text: "Curvy for users",
    link: "/for-users/",
    collapsed: true,
    items: [
      {
        text: "Register your Curvy ID",
        link: "/for-users/register-your-curvy-id",
        items: [
          { text: "Using a passkey", link: "/for-users/register-your-curvy-id#step-2a-register-using-a-passkey" },
          {
            text: "Using an existing wallet",
            link: "/for-users/register-your-curvy-id#step-2b-register-using-an-existing-wallet",
          },
        ],
      },
      { text: "Make existing assets private", link: "/for-users/make-your-existing-assets-private" },
      {
        text: "Receive assets privately",
        link: "/for-users/receive-assets-privately",
        items: [
          { text: "By sharing your ENS", link: "/for-users/receive-assets-privately#by-sharing-your-ens" },
          {
            text: "By sharing your public URL",
            link: "/for-users/receive-assets-privately#by-sharing-your-public-url",
          },
          {
            text: "By generating a private address",
            link: "/for-users/receive-assets-privately#by-generating-a-private-address",
          },
        ],
      },
      {
        text: "Send assets privately",
        link: "/for-users/send-assets-privately",
        items: [
          { text: "To a Curvy ID", link: "/for-users/send-assets-privately#send-to-curvy-id" },
          { text: "To an external wallet", link: "/for-users/send-assets-privately#send-to-external-wallet" },
          { text: "As a link", link: "/for-users/send-assets-privately#send-as-a-link" },
        ],
      },
      { text: "Swap assets privately", link: "/for-users/swap-assets-privately" },
    ],
  },
  {
    text: "Curvy for the curious",
    link: "/for-the-curious/",
    collapsed: true,
    items: [
      {
        text: "In-depth walkthroughs",
        link: "/for-the-curious/walkthroughs/",
        items: [
          { text: "Receiving funds privately", link: "/for-the-curious/walkthroughs/receiving-funds-privately" },
          { text: "Sending funds privately", link: "/for-the-curious/walkthroughs/sending-funds-privately" },
          {
            text: "Unshielding funds privately",
            link: "/for-the-curious/walkthroughs/unshielding-funds-privately",
          },
          { text: "Sending funds to anyone", link: "/for-the-curious/walkthroughs/sending-funds-to-anyone" },
        ],
      },
      {
        text: "Building blocks",
        link: "/for-the-curious/building-blocks/",
        items: [
          { text: "Curvy ID", link: "/for-the-curious/building-blocks/curvy-id" },
          { text: "Portals", link: "/for-the-curious/building-blocks/portals" },
          { text: "Privacy aggregator", link: "/for-the-curious/building-blocks/privacy-aggregator" },
          { text: "Curvy SDK", link: "/for-the-curious/building-blocks/curvy-sdk" },
        ],
      },
      { text: "Privacy model", link: "/for-the-curious/privacy-model" },
      { text: "Compliance model", link: "/for-the-curious/compliance-model" },
    ],
  },
  {
    text: "Developer guides",
    link: "/for-programmers/",
    items: [
      { text: "Installing the SDK", link: "/for-programmers/installing-the-sdk" },
      { text: "Authentication", link: "/for-programmers/authentication" },
      { text: "Querying balances", link: "/for-programmers/querying-balances" },
      { text: "Interacting with assets", link: "/for-programmers/interacting-with-assets" },
      { text: "Portals & recovery", link: "/for-programmers/portals-and-recovery" },
      { text: "Listening to events", link: "/for-programmers/listening-to-events" },
      { text: "Wallet SDK reference", link: "/sdk/" },
      { text: `Payments SDK ${newBadge}`, link: "/sdk/payments/" },
    ],
  },
  {
    text: "Curvy for businesses",
    link: "/for-businesses/",
    collapsed: true,
    items: [
      { text: "Accepting payments", link: "/for-businesses/accepting-payments" },
      { text: "For enterprises and institutions", link: "/for-businesses/for-enterprises-and-institutions" },
      { text: "For networks", link: "/for-businesses/for-networks" },
      { text: "For wallets and Web3 products", link: "/for-businesses/for-wallets-and-web3-products" },
    ],
  },
];

const configSidebarItems = [
  { text: "createCurvyConfig", link: "/sdk/config/createCurvyConfig" },
  { text: "createBrowserCurvyConfig", link: "/sdk/config/createBrowserCurvyConfig" },
  { text: "createServerCurvyConfig", link: "/sdk/config/createServerCurvyConfig" },
  { text: "createNativeCurvyConfig", link: "/sdk/config/createNativeCurvyConfig" },
  { text: "destroyConfig", link: "/sdk/config/destroyConfig" },
  { text: "getCurvyConfig", link: "/sdk/config/getCurvyConfig" },
  { text: "peekCurvyConfig", link: "/sdk/config/peekCurvyConfig" },
  { text: "setCurvyConfig", link: "/sdk/config/setCurvyConfig" },
  { text: "getActiveNetworks", link: "/sdk/config/getActiveNetworks" },
  { text: "getDefaultAggregatorNetwork", link: "/sdk/config/getDefaultAggregatorNetwork" },
  { text: "acceptsPortalShield", link: "/sdk/config/acceptsPortalShield" },
  { text: "getEnvironment", link: "/sdk/config/getEnvironment" },
  { text: "getProtocol", link: "/sdk/config/getProtocol" },
] satisfies DefaultTheme.SidebarItem[];

const documentedConfigFunctions = new Set(configSidebarItems.map((item) => item.text));
for (const name of configFunctionNames) {
  if (!documentedConfigFunctions.has(name)) {
    throw new Error(`Public SDK config function "${name}" is missing from the documentation navigation.`);
  }
}
for (const name of documentedConfigFunctions) {
  if (!configFunctionNames.includes(name)) {
    throw new Error(`Documented SDK config function "${name}" is not a public config export.`);
  }
}

const sdkSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "Getting started",
    items: [
      { text: "Introduction", link: "/sdk/" },
      { text: "Getting started", link: "/sdk/getting-started" },
      { text: "TypeScript", link: "/sdk/typescript" },
      { text: `Payments SDK ${newBadge}`, link: "/sdk/payments/" },
    ],
  },
  {
    text: "Config",
    link: "/sdk/config/",
    items: configSidebarItems,
  },
  {
    text: "Actions",
    link: "/sdk/actions/",
    items: actionGroups.map(
      (group): DefaultTheme.SidebarItem => ({
        text: group.label.replace(/ actions$/, ""),
        collapsed: true,
        items: group.actions.map((action) => ({
          text: action.name,
          link: `/sdk/actions/${action.category}/${action.name}`,
        })),
      }),
    ),
  },
  {
    text: "Guides",
    items: [
      { text: "Authentication", link: "/for-programmers/authentication" },
      { text: "Interacting with assets", link: "/for-programmers/interacting-with-assets" },
      { text: "Portals & recovery", link: "/for-programmers/portals-and-recovery" },
      { text: "Listening to events", link: "/for-programmers/listening-to-events" },
    ],
  },
];

const paymentsSdkSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: "Payments SDK",
    items: [
      { text: "Introduction", link: "/sdk/payments/" },
      { text: "Getting started", link: "/sdk/payments/getting-started" },
      { text: "Human checkout", link: "/sdk/payments/human-checkout" },
      { text: "x402 (agents)", link: "/sdk/payments/x402" },
      { text: "Fees and minimums", link: "/sdk/payments/fees" },
      { text: "Confirming payments", link: "/sdk/payments/confirming-payments" },
      { text: "API surface", link: "/sdk/payments/api" },
    ],
  },
  {
    text: "Related",
    items: [
      { text: "Accepting payments", link: "/for-businesses/accepting-payments" },
      { text: "Wallet SDK", link: "/sdk/" },
      { text: "Portals", link: "/for-the-curious/building-blocks/portals" },
    ],
  },
];

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".vitepress" || entry.name === "public") return [];
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith(".md") ? [path] : [];
  });
}

function withoutFrontmatter(markdown: string): string {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function frontmatterValue(markdown: string, key: string): string | undefined {
  const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  const value = frontmatter?.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim();
  return value?.replace(/^(["'])(.*)\1$/, "$2");
}

function pageTitle(markdown: string, fallback: string): string {
  return (
    frontmatterValue(markdown, "title") ??
    withoutFrontmatter(markdown)
      .match(/^#\s+(.+)$/m)?.[1]
      ?.trim() ??
    fallback
  );
}

function pageDescription(markdown: string): string {
  const description = frontmatterValue(markdown, "description");
  if (description) return description;

  const lines = withoutFrontmatter(markdown).split(/\r?\n/);
  return (
    lines
      .find((line) => {
        const value = line.trim();
        return value.length > 0 && !/^(#|>|-|\*|```|:::|<|import\s)/.test(value);
      })
      ?.trim() ?? ""
  );
}

function pageUrl(relativePath: string): string {
  const route = relativePath.replace(/\.md$/, "").replace(/(^|\/)index$/, "$1");
  return `/${route}`.replace(/\/{2,}/g, "/");
}

function rawPageMetadata(relativePath: string, title: string) {
  const path = `/_raw/${relativePath}`;
  return {
    rawMarkdownPath: path,
    rawMarkdownTitle: title,
    rawMarkdownUrl: `${siteOrigin}${path}`,
  };
}

function rawMarkdownFor(relativePath: string): string | undefined {
  const generated = generatedReferencePages.find((page) => page.relativePath === relativePath);
  if (generated) return generated.markdown;
  if (relativePath.includes("..") || !relativePath.endsWith(".md")) return;

  const sourcePath = resolve(docsRoot, relativePath);
  if (!sourcePath.startsWith(`${docsRoot}/`) || !existsSync(sourcePath)) return;
  return readFileSync(sourcePath, "utf8");
}

function writeAiDocumentation(outDir: string): void {
  const staticPages = markdownFiles(docsRoot)
    .map((path) => {
      const relativePath = relative(docsRoot, path).replaceAll("\\", "/");
      if (relativePath.includes("[")) return undefined;
      const markdown = readFileSync(path, "utf8");
      return {
        markdown,
        relativePath,
        title: pageTitle(markdown, relativePath.replace(/\.md$/, "")),
        description: pageDescription(markdown),
      };
    })
    .filter((page): page is NonNullable<typeof page> => Boolean(page));
  const pages = [...staticPages, ...generatedReferencePages].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath),
  );

  for (const page of pages) {
    const rawPath = join(outDir, "_raw", page.relativePath);
    mkdirSync(dirname(rawPath), { recursive: true });
    writeFileSync(rawPath, page.markdown);
  }

  const index = [
    "# Curvy documentation",
    "",
    "> Privacy infrastructure, application guides, wallet SDK, and Payments SDK reference.",
    "",
    ...pages.map(
      (page) =>
        `- [${page.title}](${siteOrigin}/_raw/${page.relativePath})${page.description ? `: ${page.description}` : ""}`,
    ),
    "",
  ].join("\n");
  writeFileSync(join(outDir, "llms.txt"), index);

  const full = pages
    .map((page) => `<!-- Source: ${siteOrigin}${pageUrl(page.relativePath)} -->\n\n${page.markdown.trim()}\n`)
    .join("\n---\n\n");
  writeFileSync(join(outDir, "llms-full.txt"), `# Curvy documentation\n\n${full}`);
}

export default defineConfig({
  title: "Curvy Docs",
  description: "Curvy protocol, wallet SDK, and Payments SDK documentation",
  lastUpdated: true,
  head: [
    ["script", { async: "", src: "https://www.googletagmanager.com/gtag/js?id=G-5ZV6R7929G" }],
    [
      "script",
      {},
      `window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag("js", new Date());
        gtag("config", "G-5ZV6R7929G");`,
    ],
    ["link", { rel: "icon", href: "/images/favicon.png" }],
  ],
  transformPageData(pageData) {
    const referenceKind = pageData.params?.sdkReferenceKind;
    if (referenceKind === "action") {
      const action = actionReference(String(pageData.params?.category), String(pageData.params?.action));
      if (!action) throw new Error(`Unknown generated SDK action page: ${pageData.relativePath}`);
      return {
        title: action.name,
        description: action.summary,
        frontmatter: {
          ...pageData.frontmatter,
          editLink: false,
          rawMarkdown: renderActionPage(action),
          ...rawPageMetadata(action.relativePath, action.name),
        },
      };
    }
    if (!pageData.filePath.endsWith(".md")) return;
    const sourcePath = resolve(docsRoot, pageData.filePath);
    if (!existsSync(sourcePath)) return;
    return {
      frontmatter: {
        ...pageData.frontmatter,
        rawMarkdown: readFileSync(sourcePath, "utf8"),
        ...rawPageMetadata(pageData.relativePath, pageData.title),
      },
    };
  },
  buildEnd(siteConfig) {
    writeAiDocumentation(siteConfig.outDir);
  },
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Docs", link: "/introduction" },
      {
        text: "SDK",
        items: [
          { text: "Wallet SDK", link: "/sdk/" },
          { text: "Payments SDK", link: "/sdk/payments/" },
        ],
      },
    ],
    sidebar: {
      "/sdk/payments": paymentsSdkSidebar,
      "/sdk/": sdkSidebar,
      "/": generalSidebar,
    },
    search: { provider: "local" },
    outline: { level: [2, 3], label: "On this page" },
    editLink: {
      pattern: "https://github.com/0xCurvy/curvy-monorepo/edit/main/packages/docs/docs/:path",
      text: "Suggest changes to this page",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/0xCurvy/" },
      { icon: "x", link: "https://x.com/0xcurvy" },
    ],
  },
  vite: {
    optimizeDeps: { include: ["@braintree/sanitize-url"] },
    resolve: { alias: { dayjs: "dayjs/" } },
    plugins: [
      {
        name: "curvy-raw-markdown",
        configureServer(server) {
          server.middlewares.use((request, response, next) => {
            const requestPath = request.url?.split("?", 1)[0];
            if (!requestPath?.startsWith("/_raw/")) return next();

            let relativePath: string;
            try {
              relativePath = decodeURIComponent(requestPath.slice("/_raw/".length));
            } catch {
              response.statusCode = 400;
              response.end("Invalid raw documentation path");
              return;
            }
            const markdown = rawMarkdownFor(relativePath);
            if (markdown === undefined) return next();

            response.statusCode = 200;
            response.setHeader("Content-Type", "text/markdown; charset=utf-8");
            response.end(markdown);
          });
        },
      },
    ],
  },
});
