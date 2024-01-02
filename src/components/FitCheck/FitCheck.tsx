import { Box, HStack, IconButton, Spacer, Textarea } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";
import PuffLoader from "react-spinners/PuffLoader";
import useTimelineItemRetriever from "../../hooks/useTimelineItemRetriever";
import { Response } from "../../services/timelineItemRetriever";
import ChatMessage from "../Chat/ChatMessage";
import WorkHistoryFormValues from "../WorkHistory/types";
import { placeholders } from "./constants";

interface Props {
  workHistoryItems: WorkHistoryFormValues[];
}

const FitCheck = ({ workHistoryItems }: Props) => {
  const [query, setQuery] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const { retriever } = useTimelineItemRetriever({
    workHistory: workHistoryItems,
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatWindowRef.current?.scrollBy(0, chatWindowRef.current?.scrollHeight);
    if (chatHistory.length === 0) return;
    const lastMessage = chatHistory[chatHistory.length - 1];
    if (lastMessage.from === "system") return;
    const query = lastMessage.text;
    const getDocs = async () => {
      await retriever
        ?.ask(query, true)
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
    <>
      <HStack>
        <Textarea
          height="80vh"
          width="100vw"
          value={query}
          placeholder={placeholders.textarea}
          isDisabled={isLoading}
          onChange={(e) => setQuery(e.target?.value)}
          shadow="lg"
        />
        <Box height="50px" width="50px">
          {isLoading ? (
            <PuffLoader
              cssOverride={{ opacity: 0.5 }}
              color="black"
              size="40px"
            />
          ) : (
            <IconButton
              aria-label="submit"
              title="Submit"
              icon={<LuSend />}
              onClick={() => handleSend()}
            />
          )}
        </Box>
        <Box
          borderRadius={10}
          bgColor="gray.200"
          shadow="lg"
          overflowY="scroll"
          height="80vh"
          width="100vw"
          ref={chatWindowRef}
        >
          {chatHistory.map((message) => (
            <ChatMessage message={message} key={message.seq} />
          ))}
          {isLoading && <ChatMessage isLoading={isLoading} />}
        </Box>
        <Spacer />
      </HStack>
    </>
  );
};

export default FitCheck;
