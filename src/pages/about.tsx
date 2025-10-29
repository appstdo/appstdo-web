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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaExternalLinkAlt,
} from "react-icons/fa";

import MainLayout from "../components/MainLayout";
import { fadeInFromLeft } from "../framer-motions";

// 포트폴리오 데이터 타입 정의
interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

const PortfolioPage: React.FC = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // 경력 데이터
  const experiences: Experience[] = [
    {
      title: "Full Stack Developer",
      company: "앱공방",
      period: "2022.04 - 현재",
      description:
        "네이티브 및 Flutter 앱 개발, NestJS, MySQL, PostgreSQL, Socket.io, Docker, AWS를 활용한 인프라 개발을 담당했습니다.",
    },
    {
      title: "iOS Developer",
      company: "위플래닛",
      period: "2018.01 - 2025.08",
      description:
        "iOS 앱 개발, 비즈니스 로직 구현, 디자인 패턴 적용, 테스트 코드 작성을 담당했습니다.",
    },
  ];

  // 기술 스택 데이터
  const techStacks = {
    frontend: [
      "Swift",
      "Kotlin",
      "Flutter",
      "React Native",
      "TypeScript",
      "Gatsby",
      "Chakra UI",
      "Tailwind CSS",
      "Framer Motion",
    ],
    backend: ["Node.js", "NestJS", "MySQL", "PostgreSQL", "Socket.io"],
    devops: ["Docker", "AWS", "Vercel", "Netlify", "Git", "GitHub Actions"],
    tools: ["Figma", "VS Code", "Postman", "Cursor"],
  };

  return (
    <MainLayout>
      <Container maxW="container.xl" py={8}>
        <motion.div {...fadeInFromLeft}>
          {/* 헤더 섹션 */}
          <VStack spacing={8} align="stretch">
            <Box textAlign="left" py={8}>
              <Heading as="h1" size="2xl" mb={4} lineHeight={1.4}>
                안녕하세요 <br />
                앱공방 이동석입니다
              </Heading>
              <Text
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                maxW="2xl"
              >
                앱공방은 사용자 경험을 중시하며, 깔끔하고 직관적인 앱을 개발하는
                것을 목표로 합니다.
              </Text>
            </Box>

            {/* 프로필 섹션 */}
            {/* <Box
              bg={cardBg}
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
            >
              <Profile />
            </Box> */}

            {/* 기술 스택 섹션 */}
            <Box>
              <Heading as="h2" size="xl" mb={6}>
                기술 스택
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                {Object.entries(techStacks).map(([category, technologies]) => (
                  <Card
                    key={category}
                    bg={cardBg}
                    border="1px"
                    borderColor={borderColor}
                  >
                    <CardHeader>
                      <Heading size="md" textTransform="capitalize">
                        {category}
                      </Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack spacing={2} align="stretch">
                        {technologies.map((tech) => (
                          <Badge
                            key={tech}
                            colorScheme="blue"
                            variant="subtle"
                            textAlign="center"
                            py={1}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>

            {/* 경력 섹션 */}
            <Box>
              <Heading as="h2" size="xl" mb={6}>
                경력
              </Heading>
              <VStack spacing={4} align="stretch">
                {experiences.map((exp, index) => (
                  <Box
                    key={index}
                    bg={cardBg}
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="start"
                      wrap="wrap"
                      gap={4}
                    >
                      <VStack align="start" spacing={2}>
                        <Heading size="md">{exp.title}</Heading>
                        <Text fontWeight="semibold" color="blue.500">
                          {exp.company}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          {exp.period}
                        </Text>
                      </VStack>
                    </Flex>
                    <Divider my={4} />
                    <Text color="gray.600">{exp.description}</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export const Head: HeadFC = () => {
  const title = "About - 앱공방";
  const description =
    "앱공방의 소개입니다. 앱공방은 사용자 경험을 중시하며, 깔끔하고 직관적인 앱을 개발하는 것을 목표로 합니다.";

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

export default PortfolioPage;
