import { Fade, Flex, Tab, TabList, Tabs, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "./App.css";
import ChatDrawerSection from "./components/Chat/ChatDrawerSection";
import AddWorkHistoryButton from "./components/WorkHistory/AddWorkHistoryButton";
import WorkHistoryForm from "./components/WorkHistory/WorkHistoryForm";
import WorkHistoryFormValues from "./components/WorkHistory/types";
import WorkTimelineItem from "./components/WorkTimeline/WorkTimelineItem";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [workHistory, setWorkHistory] = useState<WorkHistoryFormValues[]>([]);
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

  const saveHistory = (items: WorkHistoryFormValues[]) => {
    localStorage.setItem("resumai-work-history", JSON.stringify(items));
  };

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

  const handleAddNewEntry = () => {
    flushReplace();
    setModalOpen(true);
  };

  const handleDeleteEntry = (entry: WorkHistoryFormValues) => {
    const newWorkHistory = workHistory.filter((item) => item !== entry);
    setWorkHistory(newWorkHistory);
    saveHistory(newWorkHistory);
    flushReplace();
  };

  const handleEditEntry = (entry: WorkHistoryFormValues) => {
    const editHistoryIndex = workHistory.indexOf(entry);
    setSelectedEditHistory(workHistory[editHistoryIndex]);
    setReplaceIndex(editHistoryIndex);
    setModalOpen(true);
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
    if (workHistory.length > 0) {
      saveHistory(workHistory);
    }
  }, [workHistory, selectedEditHistory]);

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
    <Tabs
      variant="soft-rounded"
      colorScheme="orange"
      minWidth="400px"
      width="600px"
      isFitted
    >
      <Fade in={!tabsHidden} transition={{ enter: { duration: 1, delay: 1 } }}>
        <TabList
          textAlign="center"
          bgColor="tomato"
          rounded="full"
          hidden={tabsHidden}
        >
          <Tab>Ask Me Anything</Tab>
          <Tab>Fit Check</Tab>
        </TabList>
      </Fade>

      <VStack spacing="24px">
        <WorkHistoryForm
          isOpen={modalOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          workHistory={selectedEditHistory}
          replaceIndex={replaceIndex}
        />
        <AddWorkHistoryButton onAddWorkHistory={handleAddNewEntry} />
        {/* <IconButton
        aria-label="Ask me anything"
        title="Ask me anything"
        rounded="full"
        bgColor="palegreen"
        size="lg"
        icon={<FaCommentDots />}
        onClick={() => handleOpenChat(workHistory)}
      /> */}
        <Flex direction="column" align="left" m={4} pl={10} pr={10}>
          {workHistory.map((item, idx) => (
            <WorkTimelineItem
              expanded={false}
              key={idx}
              index={idx}
              workHistoryItem={item}
              onChatClick={handleOpenChat}
              onDelete={handleDeleteEntry}
              onEdit={handleEditEntry}
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
    </Tabs>
  );
}

export default App;
