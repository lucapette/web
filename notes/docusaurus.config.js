// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/duotoneLight");
const darkCodeTheme = require("prism-react-renderer/themes/duotoneDark");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Notes",
  tagline: "A public collection of notes by lucapette",
  url: "https://notes.lucapette.me",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/lucapette/web/tree/main/notes",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      }),
    ],
  ],
  plugins: ["docusaurus-plugin-sass"],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Notes",
        logo: {
          alt: "Luca Pette's avatar",
          src: "img/me.png",
        },
        items: [
          {
            href: "https://github.com/lucapette/",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        copyright:
          "Made with 💙 and <a href='https://docusaurus.io'>docusaurus</a> by <a href='https://lucapette.me'>lucapette</a></a>",
        links: [
          {
            label: "GitHub",
            href: "https://github.com/lucapette/web/tree/main/notes",
          },
          {
            label: "Twitter",
            href: "https://twitter.com/lucapette",
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["kotlin"],
      },
    }),
};

module.exports = config;
