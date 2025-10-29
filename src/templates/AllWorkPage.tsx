import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Divider,
  Link,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Image,
  useColorModeValue,
  AspectRatio,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage, getSrc } from "gatsby-plugin-image";
import React, { useState } from "react";
import { navigate } from "gatsby";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";

import MainLayout from "../components/MainLayout";
import MDXProvider from "../components/mdx/MDXProvider";
import WorkTags from "../components/WorkTags";
import { ALL_POSTS_TAG_NAME, ALL_WORKS_TAG_NAME } from "../constants";
import { fadeInFromLeft } from "../framer-motions";

interface AllWorkPageProps {
  data: GatsbyTypes.AllWorkPageQuery;
  pageContext?: {
    tag?: string;
  };
}

const AllWorkPage: React.FC<AllWorkPageProps> = ({ data, pageContext }) => {
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  // 현재 선택된 태그 (URL 파라미터에서 가져옴)
  const currentTag = pageContext?.tag || ALL_WORKS_TAG_NAME;

  // content/works 폴더에서 가져온 프로젝트 데이터
  const allWorks = data.allMdx.nodes;

  // 태그별 필터링
  const filteredWorks =
    currentTag === ALL_WORKS_TAG_NAME
      ? allWorks
      : allWorks.filter((work) => work.frontmatter?.tags?.includes(currentTag));

  const handleCardClick = (work: any) => {
    if (work.frontmatter?.slug) {
      navigate(`/works/${work.frontmatter.slug}`);
    }
  };

  return (
    <MainLayout>
      <Container maxW="container.xl" py={0}>
        {/* WorkTags 컴포넌트 추가 */}
        <WorkTags currentTag={currentTag} />

        <motion.div {...fadeInFromLeft}>
          {/* 프로젝트 섹션 */}
          <Box mt={8}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {filteredWorks
                .filter((project) => project.frontmatter) // frontmatter가 있는 것만 필터링
                .map((project, index) => (
                  <Card
                    key={index}
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                    overflow="hidden"
                    cursor="pointer"
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "lg",
                      bg: hoverBg,
                    }}
                    onClick={() => handleCardClick(project)}
                  >
                    {project.frontmatter?.thumbnail?.childImageSharp
                      ?.gatsbyImageData && (
                      <Box height="200px" overflow="hidden">
                        <GatsbyImage
                          image={
                            project.frontmatter.thumbnail.childImageSharp
                              .gatsbyImageData
                          }
                          alt={project.frontmatter.title || "프로젝트 이미지"}
                          style={{ height: "100%", width: "100%" }}
                        />
                      </Box>
                    )}
                    <CardHeader>
                      <VStack align="start" spacing={2}>
                        <Heading size="md">
                          {project.frontmatter?.title || "제목 없음"}
                        </Heading>
                        <Text color="gray.600" fontSize="sm">
                          {project.frontmatter?.description || "설명 없음"}
                        </Text>
                        <Text color="gray.500" fontSize="xs">
                          {project.frontmatter?.createdAt || "날짜 없음"}
                        </Text>
                      </VStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <HStack spacing={2} wrap="wrap">
                        {project.frontmatter?.stack
                          ?.filter((tech): tech is string => Boolean(tech))
                          .map((tech: string) => (
                            <Badge
                              key={tech}
                              colorScheme="blue"
                              variant="outline"
                              fontSize="xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
            </SimpleGrid>
          </Box>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export const query = graphql`
  query AllWorkPage {
    allMdx(
      filter: { internal: { contentFilePath: { regex: "/content/works/" } } }
      sort: { frontmatter: { createdAt: DESC } }
    ) {
      nodes {
        id
        body
        frontmatter {
          title
          description
          stack
          tags
          createdAt
          slug
          thumbnail {
            childImageSharp {
              gatsbyImageData(width: 400, height: 200, layout: CONSTRAINED)
            }
          }
        }
      }
    }
  }
`;

export const Head: HeadFC = () => {
  const title = "Works - 앱공방";
  const description =
    "앱공방의 프로젝트 모음입니다. Native, Flutter, React Native를 활용한 다양한 프로젝트들을 태그별로 확인할 수 있습니다.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
};

export default AllWorkPage;
