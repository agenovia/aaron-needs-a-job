import {
  Center,
  Fade,
  Flex,
  Grid,
  GridItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
    <Grid
      templateAreas={{
        lg: `"aside main aside"`,
        md: `"main"`,
      }}
      templateRows={`"1fr"`}
      templateColumns={{ lg: `"100px 1fr 100px"`, md: `"1fr"` }}
    >
      <GridItem gridArea="main" pt={2}>
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
                width={["200px", "400px", "600px"]}
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
                <Flex direction="column">
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
      </GridItem>
    </Grid>
  );
}

export default App;
