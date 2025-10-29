// @refresh reset
import {
  Box,
  Flex,
  VStack,
  HStack,
  Badge,
  Text,
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import PostContentTitle from "../components/PostContentTitle";
import PostLayout from "../components/PostLayout";
import { DOMAIN } from "../constants";
import { fadeInFromLeft } from "../framer-motions";
import ProjectContentTitle from "../components/ProjectContentTitle";

export const query = graphql`
  query ProjectPage($id: String!) {
    project: mdx(id: { eq: $id }) {
      frontmatter {
        slug
        title
        description
        stack
        createdAt
        thumbnail {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      tableOfContents
    }
  }
`;

interface ProjectTemplateProps {
  children: React.ReactNode;
  data: GatsbyTypes.ProjectPageQuery;
  pageContext: {
    readingTime: {
      minutes: number;
      text: string;
      time: number;
      words: number;
    };
  };
}

const ProjectTemplate: React.FC<ProjectTemplateProps> = ({
  children,
  data,
  pageContext,
}) => {
  return (
    <PostLayout>
      <motion.article style={{ width: "100%" }} {...fadeInFromLeft}>
        <Flex direction="column" width={{ base: "100%", xl: "800px" }}>
          <ProjectContentTitle
            readingTime={pageContext.readingTime.text}
            project={data.project}
          />

          {/* 프로젝트 정보 섹션 */}
          <Box marginTop="30px" marginBottom="20px">
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  프로젝트 설명
                </Text>
                <Text color="gray.600">
                  {data.project?.frontmatter?.description || "설명 없음"}
                </Text>
              </Box>

              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  기술 스택
                </Text>
                <HStack spacing={2} wrap="wrap">
                  {data.project?.frontmatter?.stack?.map(
                    (tech: string | null) => (
                      <Badge
                        key={tech}
                        colorScheme="blue"
                        variant="solid"
                        fontSize="sm"
                        px={3}
                        py={1}
                      >
                        {tech}
                      </Badge>
                    )
                  )}
                </HStack>
              </Box>

              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={2}>
                  개발 기간
                </Text>
                <Text color="gray.600">
                  {data.project?.frontmatter?.createdAt || "날짜 없음"}
                </Text>
              </Box>
            </VStack>
          </Box>

          <Box marginTop="50px">{children}</Box>
        </Flex>
      </motion.article>
    </PostLayout>
  );
};

export const Head: HeadFC<Queries.ProjectPageQuery> = ({ data }) => {
  const locale = "ko";
  const title = `${data.project?.frontmatter?.title!} - 앱공방 포트폴리오`;
  const description = data.project?.frontmatter?.description!;
  const ogimage =
    data.project?.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!;
  const metaLocale = locale === "ko" ? "ko_KR" : "en_US";

  return (
    <>
      {/* HTML Meta Tags */}
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Facebook Meta Tags */}
      <meta
        property="og:url"
        content={`${DOMAIN}/works/${data.project?.frontmatter?.slug}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={title} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getSrc(ogimage)} />
      <meta property="og:locale" content={metaLocale} />

      {/*  Twitter Meta Tags  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="appstdo.com" />
      <meta
        property="twitter:url"
        content={`${DOMAIN}/projects/${data.project?.frontmatter?.slug}`}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getSrc(ogimage)}></meta>
      <meta
        name="article:published_time"
        content={`${data.project?.frontmatter?.createdAt?.replace(
          /[/]/g,
          "-"
        )}T09:00:00.000Z`}
      />
    </>
  );
};
export default ProjectTemplate;
