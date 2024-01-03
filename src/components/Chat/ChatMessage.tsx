import { Box, Flex, Spacer, Text, VStack } from "@chakra-ui/react";
import { Document } from "langchain/document";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";

interface ChatMessage {
  from: "system" | "user";
  text: string;
  seq: number;
  sourceDocuments?: Array<Document>;
}

interface ContextCard {
  sourceDocuments?: Array<Document>;
}

interface Props {
  message?: ChatMessage;
  isLoading?: boolean;
}

const ContextCards = ({ sourceDocuments }: ContextCard) => {
  if (!sourceDocuments || sourceDocuments.length === 0) return;

  const [seeMore, setSeeMore] = useState(false);
  const primary = sourceDocuments.slice(0, 2);
  const secondary = sourceDocuments.slice(2);
  return (
    <Box bgColor="blackAlpha.200" borderRadius={10} mt={4} p={4}>
      <VStack align="left" opacity={0.6}>
        <Text as="b">Context sources:</Text>
        {sourceDocuments.length > 0 && (
          <>
            {primary.map((x, idx) => (
              <div key={idx}>
                <Text fontSize="8px" as="sup" pr={1}>
                  {idx + 1}
                </Text>
                <Text as="span">
                  {x.metadata.headline ??
                    `Work responsibilities as ${x.metadata.jobTitle} at ${x.metadata.company}`}
                </Text>
              </div>
            ))}
            {!seeMore && secondary.length > 0 && (
              <Text as="i" onClick={() => setSeeMore(true)} cursor="pointer">
                ... and {secondary.length} more
              </Text>
            )}
            {seeMore &&
              secondary.map((x, idx) => (
                <div key={idx}>
                  <Text fontSize="8px" as="sup" pr={1}>
                    {primary.length + idx + 1}
                  </Text>
                  <Text as="span">
                    {x.metadata.headline ??
                      `Work responsibilities as ${x.metadata.jobTitle} at ${x.metadata.company}`}
                  </Text>
                </div>
              ))}
            {seeMore && (
              <Text
                as="sub"
                cursor="pointer"
                fontSize="xs"
                pt={1}
                pb={1}
                onClick={() => setSeeMore(false)}
              >
                [collapse]
              </Text>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

const ChatMessage = ({ message, isLoading }: Props) => {
  const isUser = message?.from === "user";
  return (
    <>
      <Flex ms={isUser ? 10 : 0} me={isUser ? 0 : 10}>
        {!isLoading && isUser && <Spacer />}
        <VStack>
          <Box
            bgColor={isLoading ? "orange" : isUser ? "dodgerblue" : "orange"}
            m={2}
            p={4}
            pr={5}
            shadow="sm"
            whiteSpace="pre-line"
            rounded="lg"
          >
            <Text align="left" overflowWrap="break-word">
              {!isLoading ? (
                message?.text ?? ""
              ) : (
                <BeatLoader
                  size="8px"
                  speedMultiplier={0.7}
                  cssOverride={{ opacity: 0.5 }}
                />
              )}
            </Text>
            {!isLoading && (
              <ContextCards sourceDocuments={message?.sourceDocuments} />
            )}
          </Box>
        </VStack>
      </Flex>
    </>
  );
};

export default ChatMessage;
