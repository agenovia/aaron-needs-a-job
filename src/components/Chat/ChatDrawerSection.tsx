import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
} from "@chakra-ui/react";
import WorkHistoryFormValues from "../WorkHistory/types";
import WorkTimelineCard from "../WorkTimeline/WorkTimelineCard";
import ChatBox from "./ChatBox";

interface Props {
  workHistoryItems?: WorkHistoryFormValues[];
  handleCloseChat: () => void;
}

const ChatDrawerSection = ({ workHistoryItems, handleCloseChat }: Props) => {
  return (
    <Drawer
      placement="right"
      size="full"
      onClose={handleCloseChat}
      isOpen={!!workHistoryItems}
    >
      <DrawerOverlay />
      <DrawerContent
        bgColor="whiteAlpha.900"
        motionProps={{
          variants: {
            enter: {
              x: "0%",
              transition: { duration: 1.5 },
            },
            exit: {
              x: "0%",
              transition: { duration: 1 },
            },
          },
        }}
      >
        {workHistoryItems && (
          <>
            <DrawerCloseButton
              title="Close Chat"
              position="relative"
              ml="30px"
              boxShadow="dark-lg"
              rounded="full"
            />
            <HStack m={4} justifyContent="space-between">
              <Box maxH="80vh" overflowY="scroll" boxShadow="lg" p={1}>
                {workHistoryItems.map((item, idx) => (
                  <WorkTimelineCard
                    key={`chat-drawer-card-${idx}`}
                    workHistoryItem={item}
                  />
                ))}
              </Box>
              <ChatBox workHistoryItems={workHistoryItems} />
            </HStack>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawerSection;
