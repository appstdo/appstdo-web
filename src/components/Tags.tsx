import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { graphql, Link, useStaticQuery } from "gatsby";

import { ALL_POSTS_TAG_NAME, koreanTagNames } from "../constants";
import { convertSlugToTitle } from "../utils/string";

interface TagsProps {
  currentTag: string;
}

export default function Tags({ currentTag }: TagsProps) {
  const data = useStaticQuery(graphql`
    query Tags {
      allMdx(
        filter: {
          frontmatter: { title: { nin: "정현수 포트폴리오" } }
          internal: { contentFilePath: { regex: "/content/posts/" } }
        }
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          tagPostCount: totalCount
          tag: fieldValue
        }
        allPostCount: totalCount
      }
    }
  `);

  const currentTagPostCount = data.allMdx.group.find(
    (group: { tag: string; tagPostCount: number }) => group.tag === currentTag
  )?.tagPostCount;

  interface TagBoxProps {
    tag: string;
    tagPostCount: number;
  }

  function TagBox({ tag, tagPostCount }: TagBoxProps) {
    return (
      <Box
        px={2}
        py={1}
        borderRadius="20px"
        border="1px solid"
        borderColor="gray.300"
        // backgroundColor={currentTag === tag ? "gray.400" : "transparent"}
        backgroundColor={currentTag === tag ? "gray.700" : "transparent"}
        _dark={{
          borderColor: "gray.600",
          backgroundColor: currentTag === tag ? "gray.500" : "transparent",
        }}
      >
        <Flex justifyContent="center" alignItems="center">
          <Text
            fontSize={{ base: "16px", md: "16px" }}
            color={currentTag === tag ? "white" : "gray.900"}
            _dark={{
              color: "white",
            }}
            // fontWeight={currentTag === ALL_POSTS_TAG_NAME ? 700 : 400}
            // _hover={{ textDecoration: "underline" }}
          >
            #{koreanTagNames[tag!] || tag}
          </Text>
          <Box width="2px" />
          <Text
            fontSize="16px"
            color={currentTag === tag ? "white" : "gray.900"}
            _dark={{
              color: "white",
            }}
            // fontWeight={currentTag === ALL_POSTS_TAG_NAME ? 700 : 300}
          >
            ({tagPostCount})
          </Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Flex marginTop="80px" direction="column" width="100%" alignItems="center">
      {/* Title + Count */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          margin: "auto",
        }}
        // initial={{ opacity: 0, y: 20 }}
        // animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <Heading
          fontStyle="italic"
          fontSize={{
            base: currentTag === ALL_POSTS_TAG_NAME ? "40px" : "30px",
            md: "60px",
          }}
          fontWeight="800"
          letterSpacing={-1.5}
        >
          {convertSlugToTitle(currentTag)}.
        </Heading>
        <Text
          fontSize={{ base: "14px", md: "18px" }}
          fontStyle="italic"
          color="gray.500"
          fontWeight="200"
        >
          (
          {currentTag === ALL_POSTS_TAG_NAME
            ? data.allMdx.allPostCount
            : currentTagPostCount}
          )
        </Text>
      </motion.div>

      {/* Tag List */}
      <Flex
        as="nav"
        columnGap="10px"
        rowGap="10px"
        flexWrap="wrap"
        marginTop="40px"
        padding={{ base: "0 20px", md: "0px" }}
        width="100%"
        maxWidth="600px"
      >
        <Link to="/">
          <TagBox
            tag={ALL_POSTS_TAG_NAME}
            tagPostCount={data.allMdx.allPostCount}
          />
        </Link>
        {Object.values(data.allMdx.group).map((group) => {
          const { tag, tagPostCount } = group as {
            tag: string;
            tagPostCount: number;
          };
          return (
            <Link key={tag} to={`/tags/${tag}`}>
              <TagBox tag={tag} tagPostCount={tagPostCount} />
            </Link>
          );
        })}
      </Flex>
    </Flex>
  );
}
