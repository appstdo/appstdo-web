import { Box, DarkMode, Spacer } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

// import RSS from "../rss";
import ThemeToggler from "../theme-toggle/ThemeToggler";
import About from "./About";
import Contact from "./Contact";
import Logo from "./Logo";
import Works from "./Works";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box
      overflow="hidden"
      as="header"
      position="sticky"
      top="0"
      display="flex"
      paddingLeft={5}
      paddingRight={5}
      columnGap={4}
      zIndex="5"
      alignItems="center"
      width="100%"
      height="70px"
      transition="box-shadow 0.3s ease"
      shadow={isSticky ? "sm" : "none"}
      backgroundColor="#ffffffbb"
      backdropFilter="blur(4px)"
      _dark={{
        // backgroundColor: "#1a202cdd",
        backgroundColor: "#242424bb",
        backdropFilter: "blur(4px)",
      }}
    >
      <Logo />
      <Spacer />
      <About />
      <Works />
      <Contact />
      {/* <RSS /> */}
      <ThemeToggler />
    </Box>
  );
};

export default Header;
