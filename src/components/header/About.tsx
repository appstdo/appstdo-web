import { Text } from "@chakra-ui/react";
import { Link } from "gatsby";

const Introduction = () => {
  return (
    <Link to="/about">
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
        About
      </Text>
    </Link>
  );
};

export default Introduction;
