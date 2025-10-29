const path = require("path");
const readingTime = require(`reading-time`);

const PostPageTemplate = path.resolve(`./src/templates/PostPage.tsx`);
const TagPageTemplate = path.resolve(`./src/templates/TagPage.tsx`);
const AllWorkPageTemplate = path.resolve(`./src/templates/AllWorkPage.tsx`);
const AllPostPageTemplate = path.resolve(`./src/templates/AllPostPage.tsx`);
const ProjectPageTemplate = path.resolve(`./src/templates/ProjectPage.tsx`);

const WORDS_PER_MINUTE = 500;

exports.onCreateWebpackConfig = ({ actions, plugins, reporter }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.provide({
        React: "react",
      }),
    ],
  });

  reporter.info(`Provided React in all files`);
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      allPosts: allMdx(
        filter: { internal: { contentFilePath: { regex: "/content/posts/" } } }
      ) {
        nodes {
          id
          body
          frontmatter {
            slug
            tags
          }
          internal {
            contentFilePath
          }
        }
      }

      allTags: allMdx {
        group(field: { frontmatter: { tags: SELECT } }) {
          tag: fieldValue
          nodes {
            id
          }
        }
      }

      allWorks: allMdx(
        filter: { internal: { contentFilePath: { regex: "/content/works/" } } }
      ) {
        nodes {
          id
          body
          frontmatter {
            slug
            tags
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  const POST_PER_PAGE = 10;

  // ALL POSTS 페이지네이션 생성
  const posts = result.data.allPosts.nodes;

  const allPostsNumPages = Math.ceil(posts.length / POST_PER_PAGE);
  Array.from({ length: allPostsNumPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/` : `/${i + 1}`,
      component: AllPostPageTemplate,
      context: {
        limit: POST_PER_PAGE,
        skip: i * POST_PER_PAGE,
        numPages: allPostsNumPages,
        currentPage: i + 1,
      },
    });
  });

  // Tags 페이지네이션 생성
  const tags = result.data.allTags.group;
  tags.forEach(({ tag, nodes }) => {
    const allTagsNumPages = Math.ceil(nodes.length / POST_PER_PAGE);

    // 각 태그별로 페이지네이션 해줘야 함
    Array.from({ length: allTagsNumPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/tags/${tag}` : `/tags/${tag}/${i + 1}`,
        component: TagPageTemplate,
        context: {
          limit: POST_PER_PAGE,
          skip: i * POST_PER_PAGE,
          numPages: allTagsNumPages,
          currentPage: i + 1,
          tag,
        },
      });
    });
  });

  // 모든 포스트 페이지 생성
  result.data.allPosts.nodes.forEach((node) => {
    const path = `/posts/${node.frontmatter.slug}`;

    createPage({
      path,
      component: `${PostPageTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        tags: node.frontmatter.tags,
        slug: node.frontmatter.slug,
        id: node.id,
        readingTime: readingTime(node.body, {
          wordsPerMinute: WORDS_PER_MINUTE,
        }),
      },
    });
  });

  // 포트폴리오 페이지 생성
  createPage({
    path: `/works`,
    component: AllWorkPageTemplate,
    context: {},
  });

  // 프로젝트 태그별 페이지 생성
  const workTags = result.data.allTags.group.filter(({ tag, nodes }) => {
    // 프로젝트에만 있는 태그들만 필터링
    return nodes.some((node) =>
      result.data.allWorks.nodes.some((work) => work.id === node.id)
    );
  });

  workTags.forEach(({ tag }) => {
    createPage({
      path: `/works/tags/${tag}`,
      component: AllWorkPageTemplate,
      context: {
        tag,
      },
    });
  });

  // 각 프로젝트 개별 페이지 생성
  result.data.allWorks.nodes.forEach((node) => {
    const path = `/works/${node.frontmatter.slug}`;

    createPage({
      path,
      component: `${ProjectPageTemplate}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        tags: node.frontmatter.tags,
        slug: node.frontmatter.slug,
        id: node.id,
        readingTime: readingTime(node.body, {
          wordsPerMinute: WORDS_PER_MINUTE,
        }),
      },
    });
  });
};
