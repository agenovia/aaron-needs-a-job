import {
  Box,
  Center,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Stack,
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
            <Box mt={4} overflowY="scroll">
              <Stack
                ml={2}
                mr={2}
                justifyContent="space-between"
                direction={{ base: "column", lg: "row" }}
              >
                <Center>
                  <Box
                    p={1}
                    maxHeight="75vh"
                    w={["90vw", "90vw", "90vw", "45vw"]}
                    borderRadius={10}
                    bgColor="transparent"
                  >
                    {workHistoryItems.map((item, idx) => (
                      <WorkTimelineCard
                        key={`chat-drawer-card-${idx}`}
                        workHistoryItem={item}
                      />
                    ))}
                  </Box>
                </Center>
                <Center>
                  <Box
                    p={1}
                    height="75vh"
                    maxHeight={["450px", "550px", "750px"]}
                    w={["90vw", "90vw", "90vw", "45vw"]}
                    borderRadius={10}
                    bgColor="transparent"
                  >
                    <ChatBox workHistoryItems={workHistoryItems} />
                  </Box>
                </Center>
              </Stack>
            </Box>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawerSection;
