import type { GatsbyConfig } from "gatsby";

const path = require(`path`);

const SITE_METADATA = Object.freeze({
  title: "앱공방",
  description: "앱공방",
  siteUrl: process.env.URL || "https://appstdo.com",
});

const wrapESMPlugin = (name: string) =>
  function wrapESM(opts: any) {
    return async (...args: any[]) => {
      const mod = await import(name);
      const plugin = mod.default(opts);
      return plugin(...args);
    };
  };

const config: GatsbyConfig = {
  siteMetadata: SITE_METADATA,
  graphqlTypegen: true,
  trailingSlash: `always`,
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: "gatsby-remark-gifs",
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
              wrapperStyle: `margin: 25px 0px; z-index: 0; border-radius: 10px;`,
              showCaptions: true,
            },
          },
        ],
        mdxOptions: {
          rehypePlugins: [
            [wrapESMPlugin(`rehype-slug`)],
            [
              wrapESMPlugin(`rehype-autolink-headings`),
              {
                behavior: "append",
                content: {
                  type: `element`,
                  tagName: `span`,
                  properties: { className: `heading-anchor-icon` },
                  children: [
                    {
                      type: `text`,
                      value: `#`,
                    },
                  ],
                },
              },
            ],
          ],
        },
      },
    },
    "gatsby-plugin-mdx-frontmatter",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: path.resolve(__dirname, "./content"),
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `categories`,
        path: path.resolve(__dirname, "./content/"),
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-typegen",
      options: {
        outputPath: `src/__generated__/gatsby-types.d.ts`,
        emitSchema: {
          "src/__generated__/gatsby-schema.graphql": true,
        },
      },
    },
    {
      resolve: "@chakra-ui/gatsby-plugin",
      options: {
        resetCSS: true,
      },
    },
    `gatsby-plugin-advanced-sitemap`,
    {
      resolve: `gatsby-plugin-clarity`,
      options: {
        // Clarity 프로젝트 ID의 문자열 값
        clarity_project_id: "t5f98bwnlu",
        // 개발하는 동안 Clarity를 사용하기 위한 부울 값
        // true로 설정하면 개발 및 프로덕션 환경 모두에서 Clarity 추적 코드를 사용합니다.
        // false로 설정하면 프로덕션 환경에서만 Clarity 추적 코드를 사용합니다.
        enable_on_dev_env: false,
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/assets/favicon.png",
      },
    },
  ],
};

export default config;
