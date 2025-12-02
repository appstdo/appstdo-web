import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Textarea,
  VStack,
  useToast,
  useColorModeValue,
  HStack,
  Icon,
  Link,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { type HeadFC } from "gatsby";
import React, { useState } from "react";

import MainLayout from "../components/MainLayout";
import { fadeInFromLeft } from "../framer-motions";
import { FaEnvelope, FaGithub } from "react-icons/fa";

interface FormData {
  name: string;
  email: string;
  position: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    position: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요";
    }

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요";
    }

    if (!formData.position.trim()) {
      newErrors.position = "직책을 입력해주세요";
    }

    if (!formData.message.trim()) {
      newErrors.message = "내용을 입력해주세요";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Slack 웹훅으로 메시지 전송
      const slackMessage = {
        text: "새로운 연락 요청이 도착했습니다!",
        attachments: [
          {
            color: "good",
            fields: [
              {
                title: "이름",
                value: formData.name,
                short: true,
              },
              {
                title: "이메일",
                value: formData.email,
                short: true,
              },
              {
                title: "직책",
                value: formData.position,
                short: true,
              },
              {
                title: "내용",
                value: formData.message,
                short: false,
              },
            ],
            footer: "앱공방 웹사이트",
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      };

      // 환경변수에서 Slack 웹훅 URL 가져오기
      const webhookUrl = process.env.GATSBY_SLACK_WEBHOOK_URL;

      if (!webhookUrl) {
        throw new Error("Slack 웹훅 URL이 설정되지 않았습니다");
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(slackMessage),
      });

      if (!response.ok) {
        throw new Error("메시지 전송에 실패했습니다");
      }

      toast({
        title: "메시지가 전송되었습니다!",
        description: "빠른 시일 내에 연락드리겠습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        position: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "전송 실패",
        description: "메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <Container maxW="container.md" py={8}>
        <motion.div {...fadeInFromLeft}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center" py={8}>
              <Heading as="h1" size="2xl" mb={4}>
                연락하기
              </Heading>
              <Box
                fontSize="lg"
                color="gray.600"
                _dark={{ color: "gray.400" }}
                maxW="2xl"
                mx="auto"
              >
                프로젝트 문의나 협업 제안이 있으시면 언제든지 연락해주세요.
                <br />
                빠른 시일 내에 답변드리겠습니다.
              </Box>
            </Box>

            <Box
              bg={cardBg}
              p={8}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
            >
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  <FormControl isInvalid={!!errors.name}>
                    <FormLabel htmlFor="name">이름 *</FormLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="홍길동"
                      bg={bgColor}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.email}>
                    <FormLabel htmlFor="email">이메일 *</FormLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      bg={bgColor}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.position}>
                    <FormLabel htmlFor="position">직책 *</FormLabel>
                    <Input
                      id="position"
                      name="position"
                      type="text"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="프론트엔드 개발자"
                      bg={bgColor}
                    />
                    <FormErrorMessage>{errors.position}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.message}>
                    <FormLabel htmlFor="message">내용 *</FormLabel>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="프로젝트에 대한 자세한 내용을 작성해주세요..."
                      rows={6}
                      resize="vertical"
                      bg={bgColor}
                    />
                    <FormErrorMessage>{errors.message}</FormErrorMessage>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="전송 중..."
                    disabled={isSubmitting}
                  >
                    연락하기
                  </Button>
                </VStack>
              </form>
            </Box>
            {/* 연락처 섹션 */}
            <Box>
              <Box
                bg={cardBg}
                p={6}
                borderRadius="lg"
                border="1px"
                borderColor={borderColor}
              >
                <VStack spacing={4} align="start">
                  <HStack spacing={4}>
                    <Icon as={FaEnvelope} boxSize={5} />
                    <Link href="mailto:jason@appstdo.com" color="blue.500">
                      jason@appstdo.com
                    </Link>
                  </HStack>
                  <HStack spacing={4}>
                    <Icon as={FaGithub} boxSize={5} />
                    <Link
                      href="https://github.com/ldongg"
                      isExternal
                      color="blue.500"
                    >
                      github.com/ldongg
                    </Link>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </VStack>
        </motion.div>
      </Container>
    </MainLayout>
  );
};

export const Head: HeadFC = () => {
  const title = "Contact - 앱공방";
  const description =
    "앱공방에 프로젝트 문의나 협업 제안을 보내주세요. 빠른 시일 내에 답변드리겠습니다.";

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

export default ContactPage;
