import React, { useState, useEffect } from "react";
import { Box, Container, Heading, Text, VStack, Button, Flex, SimpleGrid, Icon, Image, HStack } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {

  const useCases = [
    "Borrow funds based on your on-chain credit score.",
    "Lend funds to earn interest and improve your credit score.",
    "Track your borrowing and lending history.",
    "Refresh your credit score based on your on-chain activity.",
    "View available loans and choose the best option for you.",
    "Repay loans and increase your credit score.",
    "Monitor your credit score and improve it by lending.",
    "Get rewarded for timely repayments and responsible lending.",
  ];

  const headlines = [
    "Decentralized Lending Platform for Everyone",
    "Borrow and Lend with Confidence and Transparency",
    "Empowering Financial Freedom through Blockchain",
    "Your Gateway to Decentralized Finance",
    "Secure, Transparent, and Fair Lending"
  ];

  const whyChooseUs = [
    {
      title: "Decentralized Borrowing",
      description: "Request loans based on your credit score and repay with ease.",
      image: "/borrow.png",
    },
    {
      title: "Earn Interest by Lending",
      description: "Lend your funds to earn interest and improve your credit score.",
      image: "/lend.png",
    },
    {
      title: "Dynamic Credit Scores",
      description: "Your credit score is updated based on your on-chain activity.",
      image: "/credit_score.png",
    },
    {
      title: "Transparent and Secure",
      description: "All transactions are secured and transparent on the blockchain.",
      image: "/security.png",
    },
    {
      title: "Community Driven",
      description: "Join a community of responsible borrowers and lenders.",
      image: "/community.png",
    },
    {
      title: "Reward System",
      description: "Get rewarded for timely repayments and responsible lending.",
      image: "/rewards.png",
    },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [currentWhyIndex, setCurrentWhyIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % useCases.length);
    }, 3000); // Change slide every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const headlineInterval = setInterval(() => {
      setCurrentHeadlineIndex((prevIndex) => (prevIndex + 1) % headlines.length);
    }, 5000); // Change headline every 5 seconds
    return () => clearInterval(headlineInterval);
  }, []);

  useEffect(() => {
    const whyInterval = setInterval(() => {
      setCurrentWhyIndex((prevIndex) => (prevIndex + 1) % whyChooseUs.length);
    }, 3000); // Change content every 3 seconds
    return () => clearInterval(whyInterval);
  }, []);


  return (
    <Box minHeight="100vh" bgGradient="linear(to-r, teal.600, lightBlue.600)" color="white">
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <motion.div
              key={currentHeadlineIndex}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Heading as="h1" fontSize="5xl" mb={4} color="yellow.300">
                {headlines[currentHeadlineIndex]}
              </Heading>
            </motion.div>
            <Link to="/borrow">
                <Button size="lg" colorScheme="blue">
                    Get Started
                </Button>
            </Link>
          </Box>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Heading as="h2" size="2xl" mb={4} textAlign="center">
              Why Choose Us?
            </Heading>
          </motion.div>
          <Box bg="white" color="black" p={8} borderRadius="xl" boxShadow="2xl" position="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWhyIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <VStack spacing={6} align="stretch">
                  <Box position="relative" h="200px" overflow="hidden" borderRadius="lg">
                    <Image
                      src={whyChooseUs[currentWhyIndex].image}
                      alt={whyChooseUs[currentWhyIndex].title}
                      objectFit="contain"
                      w="100%"
                      h="100%"
                      borderRadius="lg"
                      boxShadow="lg"
                    />
                  </Box>
                  <Heading as="h3" size="lg" fontWeight="bold" fontFamily="Arial" color="teal.300">
                    {whyChooseUs[currentWhyIndex].title}
                  </Heading>
                  <Text fontSize="md" color="black" fontFamily="Arial" textAlign="justify">
                    {whyChooseUs[currentWhyIndex].description}
                  </Text>
                </VStack>
              </motion.div>
            </AnimatePresence>
          </Box>
          <Box textAlign="center" mt={16}>
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <Heading as="h2" size="2xl" mb={4}>
                Powered by
              </Heading>
              <HStack spacing={5} justify="center">
                <Image src="/crossfi.png" width="250px" height="250px" alt="CrossFi Icon" />
              </HStack>
              <Text fontSize="lg" mb={8} color="yellow.300">
                Leveraging the power of blockchain to ensure transparency, security, and fair compensation.
              </Text>
            </motion.div>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <Box bg="white" color="black" p={8} borderRadius="md" boxShadow="2xl">
                <Box position="relative" h="100px" overflow="hidden" borderRadius="lg" mb={4}>
                  <Image
                    src="/use_case.png"
                    alt="Use Cases"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Heading as="h3" size="md" mb={2} color="teal.300">Use Cases</Heading>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={itemVariants}
                  >
                    <Text as="span" className="animated-text" fontSize="md" color="black" fontFamily="Arial" textAlign="justify">
                      {useCases[currentIndex]}
                    </Text>
                  </motion.div>
                </AnimatePresence>
              </Box>
              <Box bg="white" color="black" p={8} borderRadius="md" boxShadow="2xl">
                <Box position="relative" h="100px" overflow="hidden" borderRadius="lg" mb={4}>
                  <Image
                    src="/smart_contract.png"
                    alt="Smart Contracts"
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Heading as="h3" size="md" mb={2} color="teal.300">Smart Contracts</Heading>
                <Text fontSize="md" color="black" fontFamily="Arial" textAlign="justify">
                  Facilitate transactions and ensure fair compensation for contributors.
                </Text>
              </Box>
              <Box bg="white" color="black" p={8} borderRadius="md" boxShadow="2xl">
                <Box position="relative" h="100px" overflow="hidden" borderRadius="lg" mb={4}>
                  <Image
                    src="/xfi.png"
                    alt="Token System"
                    objectFit="contain"
                    w="100%"
                    h="100%"
                  />
                </Box>
                <Heading as="h3" size="md" mb={2} color="teal.300">Reward System</Heading>
                <Text fontSize="md" color="black" fontFamily="Arial" textAlign="justify">
                  Reward participants with tokens for their contributions.
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}