import { Box, Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import { koreanTagNames } from "../constants";

interface ProjectContentTitleProps {
  readingTime: string;
  project: GatsbyTypes.ProjectPageQuery["project"];
}

const ProjectContentTitle = ({
  project,
  readingTime,
}: ProjectContentTitleProps) => {
  const { colorMode } = useColorMode();
  return (
    <Flex
      width="100%"
      position="relative"
      flexDirection="column"
      alignItems="baseline"
      isolation="isolate"
    >
      <Heading
        as="h1"
        fontSize={36}
        marginBottom="3"
        fontWeight={900}
        wordBreak="break-word"
      >
        {project?.frontmatter?.title}
      </Heading>
      <Flex columnGap="14px" rowGap="10px" alignItems="end" flexWrap="wrap">
        <Box
          color={colorMode === "dark" ? "gray.50" : "gray.900"}
          borderColor={colorMode === "dark" ? "gray.50" : "gray.900"}
          border="2px solid"
          borderRadius="20px"
          padding="6px 10px"
          fontSize="14px"
          fontWeight="800"
          width="fit-content"
        >
          {project?.frontmatter?.createdAt}
        </Box>
        {project?.frontmatter?.tags?.map((tag) => (
          <Link key={tag} to={`/tags/${tag}`}>
            <Box
              key={tag}
              color={colorMode === "dark" ? "gray.50" : "gray.900"}
              borderColor={colorMode === "dark" ? "gray.50" : "gray.900"}
              border="2px solid"
              borderRadius="20px"
              padding="6px"
              fontSize="14px"
              fontWeight="800"
              width="fit-content"
            >
              {koreanTagNames[tag!] || tag}
            </Box>
          </Link>
        ))}
        <Text fontSize="12px">{readingTime}</Text>
      </Flex>

      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        maxHeight="700px"
        justifyContent="center"
        alignItems="center"
        isolation="isolate"
        borderRadius="20px"
        overflow="hidden"
        marginTop="20px"
      >
        <GatsbyImage
          image={
            project?.frontmatter?.thumbnail?.childImageSharp?.gatsbyImageData!
          }
          alt={project?.frontmatter?.title!}
        />
      </Box>
    </Flex>
  );
};

export default ProjectContentTitle;
