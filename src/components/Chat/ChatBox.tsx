import {
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { BaseMessage } from "langchain/schema";
import { useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import PuffLoader from "react-spinners/PuffLoader";
import useTimelineItemRetriever from "../../hooks/useTimelineItemRetriever";
import { Response } from "../../services/timelineItemRetriever";
import WorkHistoryFormValues from "../WorkHistory/types";
import ChatMessage from "./ChatMessage";
import "./animations.css";

interface Props {
  workHistoryItems: WorkHistoryFormValues[];
  fitCheckForm?: boolean;
}

const ChatBox = ({ workHistoryItems }: Props) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const { retriever } = useTimelineItemRetriever({
    workHistory: workHistoryItems,
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const splashMessage = `Hi, I'm Aaron's AI. I have access to rich context on Aaron's work history, \
  allowing me to dive deep into questions you might have regarding his fit and capacity. \
  Try asking questions like "Tell me about your experience leading a team", or "How have you leveraged \
  your skills in data analysis to deliver a project?", or "Explain the challenges of [...]"`;

  useEffect(() => {
    const setChatFromMemory = async () => {
      const savedMemory = await retriever?.memory.loadMemoryVariables({});
      const chatHistory = savedMemory?.chatHistory;
      if (chatHistory) {
        // setChatHistory(chatHistory);
        chatHistory.map((chatMessage: BaseMessage, idx: number) => {
          if (chatMessage._getType() === "human") {
            setChatHistory([
              ...chatHistory,
              { from: "user", text: chatMessage.content, seq: idx },
            ]);
          } else if (chatMessage._getType() === "ai") {
            setChatHistory([
              ...chatHistory,
              { from: "system", text: chatMessage.content, seq: idx },
            ]);
          }
        });
      } else {
        handleSystemMessage({ result: splashMessage, sourceDocuments: [] });
      }
    };
    setChatFromMemory();
  }, []);

  useEffect(() => {
    chatWindowRef.current?.scrollBy(0, chatWindowRef.current?.scrollHeight);
    if (chatHistory.length === 0) return;
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage.from === "system") return;
    const query = lastMessage.text;
    const getDocs = async () => {
      await retriever
        ?.ask(query)
        .then((response) => handleSystemMessage(response));
    };
    getDocs();
  }, [chatHistory]);

  const handleSystemMessage = (response: Response) => {
    const message = response.result.trim();
    setChatHistory([
      ...chatHistory,
      {
        from: "system",
        text:
          message.length > 0
            ? message
            : "I'm sorry, I don't understand, could you rephrase that?",
        seq: chatHistory.length + 1,
        sourceDocuments: response.sourceDocuments,
      } as ChatMessage,
    ]);
    setIsLoading(false);
  };

  const handleSend = () => {
    if (query.trim() === "") return;
    const message = {
      from: "user",
      text: query.trim(),
      seq: chatHistory.length + 1,
    } as ChatMessage;
    setChatHistory([...chatHistory, message]);
    setQuery("");
    setIsLoading(true);
  };
  return (
    <Center>
      <VStack h="90vh" w="60vw">
        <Box
          borderRadius={10}
          bgColor="gray.200"
          shadow="lg"
          overflowY="scroll"
          minH="40vh"
          maxH="80vh"
          h="80vh"
          minW="60vw"
          w="60vw"
          ref={chatWindowRef}
        >
          {chatHistory.map((message) => (
            <ChatMessage message={message} key={message.seq} />
          ))}
          {isLoading && <ChatMessage isLoading={isLoading} />}
        </Box>
        <HStack w="inherit">
          <InputGroup>
            <Input
              className={!isLoading ? "ripple" : ""}
              bgColor="gray.300"
              variant="outline"
              shadow="lg"
              title={isLoading ? "🤔" : "Ask a question"}
              placeholder={isLoading ? "Thinking..." : "Ask a question"}
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              isDisabled={isLoading}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <InputRightElement>
              {isLoading ? (
                <PuffLoader
                  cssOverride={{ opacity: 0.5 }}
                  color="black"
                  size="25px"
                />
              ) : (
                <IconButton
                  aria-label="send-query"
                  title="Send Query"
                  icon={<LuSend />}
                  h="100%"
                  variant="ghost"
                  rounded="full"
                  onClick={() => handleSend()}
                />
              )}
            </InputRightElement>
          </InputGroup>
        </HStack>
      </VStack>
    </Center>
  );
};

export default ChatBox;
