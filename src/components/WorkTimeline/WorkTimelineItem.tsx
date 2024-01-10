import {
  Box,
  Flex,
  HStack,
  Icon,
  SlideFade,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GoDot, GoDotFill } from "react-icons/go";

import WorkHistoryFormValues from "../WorkHistory/types";
import "./styles.css";
import WorkTimelineCard from "./WorkTimelineCard";

interface Props {
  workHistoryItem: WorkHistoryFormValues;
  expanded: boolean;
  index: number;
  onDelete?: (entry: WorkHistoryFormValues) => void;
  onEdit?: (entry: WorkHistoryFormValues) => void;
  onChatClick: (
    workHistory: WorkHistoryFormValues[],
    metadataFilter?: Record<string, unknown>
  ) => void;
}

const WorkTimelineItem = ({
  workHistoryItem,
  expanded,
  index,
  onChatClick,
}: Props) => {
  const [isExpanded, setExpanded] = useState(expanded);
  const isCurrent = workHistoryItem.endDate.length === 0;
  const delayMultiplier = Math.max(+(0.75 / (index + 1)).toFixed(2), 0.05);

  useEffect(() => {
    setTimeout(() => {
      setExpanded(true);
    }, 500);
  }, []);

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");
    const totalMonths =
      end.getMonth() -
      start.getMonth() +
      12 * (end.getFullYear() - start.getFullYear());
    const months = totalMonths % 12;
    const years = Math.floor(totalMonths / 12);
    const arr = [];
    if (years === 1) {
      arr.push(`${years} year`);
    } else if (years > 1) {
      arr.push(`${years} years`);
    }

    if (months === 1) {
      arr.push(`${months} month`);
    } else if (months > 1) {
      arr.push(`${months} months`);
    }

    if (arr.length > 0) {
      return arr.join(", ");
    } else {
      return "Less than 1 month";
    }
  };

  return (
    <SlideFade
      in={isExpanded}
      transition={{
        exit: { duration: 0.5 },
        enter: {
          duration: 1.2,
          delay: delayMultiplier ? delayMultiplier * 1 : 0,
        },
      }}
      offsetX="-80px"
      offsetY="0px"
      unmountOnExit
    >
      <Box pt={2} pb={2}>
        <Flex direction="row">
          <HStack spacing={4} pb={1} pl="2px">
            <Icon as={isCurrent ? GoDotFill : GoDot} position="absolute" />
            <HStack align="baseline">
              {isCurrent ? (
                <Text as="b" pl="20px">
                  Present
                </Text>
              ) : (
                <Text pl="20px">{workHistoryItem.endDate}</Text>
              )}
              <Text fontSize="12px" as="em">
                {getDuration(
                  workHistoryItem.startDate,
                  workHistoryItem.endDate
                )}
              </Text>
            </HStack>
          </HStack>
        </Flex>
        <HStack spacing={2}>
          <Flex m={2}>
            <Box pr="2px" bgColor="tomato" w="1px" h="inherit" rounded="full" />
            <Flex
              className="main-content"
              bg="papayawhip"
              direction="row"
              shadow="md"
            >
              <VStack spacing={2}>
                <WorkTimelineCard
                  workHistoryItem={workHistoryItem}
                  onChatClick={onChatClick}
                />
              </VStack>
            </Flex>
          </Flex>
        </HStack>
        <Flex direction="row">
          <HStack spacing={4} pb={1} pl="2px">
            <Icon as={GoDot} position="absolute" />
            <Text pl="20px">{workHistoryItem.startDate}</Text>
          </HStack>
        </Flex>
      </Box>
    </SlideFade>
  );
};

export default WorkTimelineItem;
