import { useState } from "react";
import useTimelineItemRetriever from "../../hooks/useTimelineItemRetriever";
import WorkHistoryFormValues from "../WorkHistory/types";
import { HStack, Spacer, Textarea } from "@chakra-ui/react";

interface Props {
  workHistoryItems: WorkHistoryFormValues[];
}

const FitCheck = ({ workHistoryItems }: Props) => {
  const [jobReq, setJobReq] = useState<string>();
  const retriever = useTimelineItemRetriever({ workHistory: workHistoryItems });

  // we need 2 things here: a form and a display window
  return (
    <>
      <HStack>
        <Textarea></Textarea>
        <Spacer />
      </HStack>
    </>
  );
};

export default FitCheck;
