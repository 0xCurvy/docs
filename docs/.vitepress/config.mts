import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "Curvy Docs",
    description: "Curvy documentation portal",
    head: [
      [
        'script',
        { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-8B1Y93VV4T' }
      ],
      [
        'script',
        {},
        `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag("js", new Date());
          gtag("config", "G-8B1Y93VV4T");`
      ],
      [
        'link',
        { rel: 'icon', href: '/images/favicon.png' }
      ]
    ],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Docs', link: '/get-started-with-curvy' }
      ],

      sidebar: [
        {
          text: 'Introduction',
          link: '/introduction',
          items: [
            {
              text: 'Frequently asked questions',
              link: '/faq',
            },
            {
              text: 'Get involved',
              link: '/get-involved',
            },
          ]
        },
        {
          text: 'Curvy for users',
          link: '/for-users/index.md',
          collapsible: true,
          items: [
            {
              text: 'Register your Curvy ID', link: '/for-users/register-your-curvy-id', items: [
                { 'text': 'using a passkey', link: '/for-users/register-your-curvy-id#step-2a-register-using-a-passkey' },
                { 'text': 'using an existing wallet', link: '/for-users/register-your-curvy-id#step-2b-register-using-an-existing-wallet' }
              ]
            },
            { text: 'Shield your existing assets', link: '/for-users/shield-your-existing-assets' },
            {
              text: 'Receive assets privately', link: '/for-users/receive-assets-privately', items: [
                { text: 'by sharing your ENS', link: '/for-users/receive-assets-privately#by-sharing-your-curvy-id-ens' },
                { text: 'by sharing your public URL', link: '/for-users/receive-assets-privately#by-sharing-your-public-page-url' },
                { text: 'by generating a private address', link: '/for-users/receive-assets-privately#by-manually-generating-a-private-address' }
              ]
            },
            {
              text: 'Send assets privately', link: '/for-users/send-assets-privately', items: [
                { text: 'to Curvy ID', link: '/for-users/send-assets-privately#send-to-curvy-id' },
                { text: 'to external wallet', link: '/for-users/send-assets-privately#send-to-external-wallet' },
                { text: 'as a link', link: '/for-users/send-assets-privately#send-as-a-link' },
              ]
            },
          ]
        },
        {
          text: 'Curvy for the curious',
          link: '/for-the-curious/index.md',
          collapsible: true,
          items: [
            {
              text: 'In-depth walkthroughs', link: '/for-the-curious/walkthroughs/index.md', items: [
                { text: 'Receiving funds privately', link: '/for-the-curious/walkthroughs/receiving-funds-privately' },
                { text: 'Sending funds privately', link: '/for-the-curious/walkthroughs/sending-funds-privately' },
                { text: 'Unshielding funds privately', link: '/for-the-curious/walkthroughs/unshielding-funds-privately' }
              ]
            },
            {
              text: 'Building blocks', link: '/for-the-curious/building-blocks/index', items: [
                { text: 'Curvy ID', link: '/for-the-curious/building-blocks/curvy-id' },
                { text: 'Portals', link: '/for-the-curious/building-blocks/portals' },
                { text: 'Privacy aggregator', link: '/for-the-curious/building-blocks/privacy-aggregator' },
                { text: 'Curvy SDK', link: '/for-the-curious/building-blocks/curvy-sdk' },
              ]
            },
            { text: 'Privacy model', link: '/for-the-curious/privacy-model' },
            { text: 'Compliance model', link: '/for-the-curious/compliance-model' },
          ]
        },
        {
          text: 'Curvy for Programmers',
          link: '/for-programmers/index',
          collapsible: true,
          items: [
            { text: 'Installing the SDK', link: '/for-programmers/installing-the-sdk' },
            { text: 'Authentication', link: '/for-programmers/authentication' },
            { text: 'Querying balances', link: '/for-programmers/querying-balances' },
            { text: 'Interacting with assets', link: '/for-programmers/interacting-with-assets' }
          ]
        },
        {

          text: 'Curvy for Businesses',
          link: '/for-businesses/index',
          collapsible: true,
          items: [
            { text: 'For institutions ', link: '/for-businesses/for-networks' },
            { text: 'For networks', link: '/for-businesses/for-networks' },
            { text: 'For wallets', link: '/for-businesses/for-networks' },
          ]
        },
      ],
      socialLinks: [
        { icon: 'github', link: 'https://github.com/0xCurvy/' },
        { icon: 'x', link: 'https://x.com/0xcurvy' }
      ]
    },
    vite: {
      optimizeDeps: { include: ['@braintree/sanitize-url'] },
      resolve: {
        alias: {
          dayjs: 'dayjs/',
        },
      },
    },
  })
)
