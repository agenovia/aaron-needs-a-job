import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Fade,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import jsonData from "../workhistory.json";
import "./App.css";
import ChatDrawerSection from "./components/Chat/ChatDrawerSection";
import FitCheck from "./components/FitCheck/FitCheck";
import WorkHistoryForm from "./components/WorkHistory/WorkHistoryForm";
import WorkHistoryFormValues from "./components/WorkHistory/types";
import WorkTimelineItem from "./components/WorkTimeline/WorkTimelineItem";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [workHistory, setWorkHistory] =
    useState<WorkHistoryFormValues[]>(jsonData);
  const [selectedEditHistory, setSelectedEditHistory] =
    useState<WorkHistoryFormValues>();
  const [selectedChatItems, setSelectedChatItems] =
    useState<WorkHistoryFormValues[]>();
  const [replaceIndex, setReplaceIndex] = useState<number>();
  const [tabsHidden, setTabsHidden] = useState(true);
  const {
    isOpen: mobileAlertIsOpen,
    onOpen: mobileAlertOnOpen,
    onClose: mobileAlertOnClose,
  } = useDisclosure();
  const acceptDisclosureRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    isMobile && mobileAlertOnOpen();
  }, []);

  const flushReplace = () => {
    setSelectedEditHistory(undefined);
    setReplaceIndex(undefined);
  };

  // const saveHistory = (items: WorkHistoryFormValues[]) => {
  //   localStorage.setItem("resumai-work-history", JSON.stringify(items));
  // };

  const handleSubmit = (
    values: WorkHistoryFormValues,
    replaceIndex?: number
  ) => {
    var newWorkHistory = workHistory;
    setModalOpen(false);
    if (replaceIndex !== undefined) {
      newWorkHistory[replaceIndex] = values;
    } else {
      newWorkHistory = [...workHistory, values];
    }
    const sortedWorkHistory = newWorkHistory.sort((a, b) => {
      if (Date.parse(a.startDate) === Date.parse(b.startDate)) {
        return 0;
      }
      return a.startDate > b.startDate ? -1 : 1;
    });
    setWorkHistory(sortedWorkHistory);
    flushReplace();
  };

  // const handleDeleteEntry = (entry: WorkHistoryFormValues) => {
  //   const newWorkHistory = workHistory.filter((item) => item !== entry);
  //   setWorkHistory(newWorkHistory);
  //   saveHistory(newWorkHistory);
  //   flushReplace();
  // };

  // const handleEditEntry = (entry: WorkHistoryFormValues) => {
  //   const editHistoryIndex = workHistory.indexOf(entry);
  //   setSelectedEditHistory(workHistory[editHistoryIndex]);
  //   setReplaceIndex(editHistoryIndex);
  //   setModalOpen(true);
  // };

  const handleCloseForm = () => {
    flushReplace();
    setModalOpen(false);
  };

  const handleOpenChat = (workHistoryItems: WorkHistoryFormValues[]) => {
    setSelectedChatItems(workHistoryItems);
  };

  const handleCloseChat = () => {
    setSelectedChatItems(undefined);
  };

  // useEffect(() => {
  //   if (workHistory.length > 0) {
  //     saveHistory(workHistory);
  //   }
  // }, [workHistory, selectedEditHistory]);

  useEffect(() => {
    setTimeout(() => {
      setTabsHidden(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const storedHistory = localStorage.getItem("resumai-work-history");
    if (storedHistory) {
      setWorkHistory([...JSON.parse(storedHistory)]);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Box maxWidth="300px">
        {isMobile && (
          <AlertDialog
            isOpen={mobileAlertIsOpen}
            leastDestructiveRef={acceptDisclosureRef}
            onClose={mobileAlertOnClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent p={2} m={2}>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Mobile device detected
                </AlertDialogHeader>

                <AlertDialogBody>
                  This site is not optimized for mobile devices. Experience will
                  be degraded. For a better experience, use a laptop or PC.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    ref={acceptDisclosureRef}
                    onClick={mobileAlertOnClose}
                  >
                    Okay
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        )}
      </Box>
      {!mobileAlertIsOpen && (
        <Tabs variant="soft-rounded" colorScheme="orange" isFitted>
          <Fade
            in={!tabsHidden}
            transition={{ enter: { duration: 2, delay: 1 } }}
          >
            <Center>
              <TabList
                textAlign="center"
                bgColor="tomato"
                rounded="full"
                minWidth="400px"
                width="600px"
                hidden={tabsHidden}
              >
                <Tab>Ask Me Anything</Tab>
                <Tab>Fit Check</Tab>
              </TabList>
            </Center>
          </Fade>

          <TabPanels>
            <TabPanel>
              <VStack spacing="24px">
                <WorkHistoryForm
                  isOpen={modalOpen}
                  onClose={handleCloseForm}
                  onSubmit={handleSubmit}
                  workHistory={selectedEditHistory}
                  replaceIndex={replaceIndex}
                />
                <Flex direction="column" align="left" m={4} pl={10} pr={10}>
                  {workHistory.map((item, idx) => (
                    <WorkTimelineItem
                      expanded={false}
                      key={idx}
                      index={idx}
                      workHistoryItem={item}
                      onChatClick={handleOpenChat}
                    />
                  ))}
                </Flex>
                {selectedChatItems && (
                  <ChatDrawerSection
                    workHistoryItems={selectedChatItems}
                    handleCloseChat={handleCloseChat}
                  />
                )}
              </VStack>
            </TabPanel>
            <TabPanel>
              <FitCheck workHistoryItems={workHistory}></FitCheck>
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </>
  );
}

export default App;
