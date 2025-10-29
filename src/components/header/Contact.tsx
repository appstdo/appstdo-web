import { Text } from "@chakra-ui/react";
import { Link } from "gatsby";

const Contact = () => {
  return (
    <Link to="/contact">
      <Text
        fontSize={14}
        fontStyle="italic"
        fontWeight={600}
        padding={1}
        _active={{ bg: "transparent" }}
      >
        Contact
      </Text>
    </Link>
  );
};

export default Contact;
