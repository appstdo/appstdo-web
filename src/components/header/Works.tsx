import { Box, Text, Tooltip } from "@chakra-ui/react";
import { Link } from "gatsby";

const Works = () => {
  return (
    <Link to="/works">
      <Text
        fontSize={14}
        fontStyle="italic"
        fontWeight={600}
        // _hover={{
        //   textDecoration: "underline",
        // }}
        padding={1}
        _active={{ bg: "transparent" }}
      >
        Works
      </Text>
    </Link>
  );
};

export default Works;
