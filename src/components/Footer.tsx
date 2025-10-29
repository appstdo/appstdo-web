import { Center } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Center
      as="footer"
      overflow="hidden"
      width="100%"
      height={100}
      fontSize={12}
    >
      © {new Date().getFullYear()}. appstdo all rights reserved.
    </Center>
  );
};

export default Footer;
