import Spinner from "@/common/button/Spinner";
import Pagination from "@/common/custom/Pagination";
import TableContent, {
  TOCItem,
} from "@/components/AdminDashboard/Content&Resources/content/medical/studyMode/TableContentForStudy";
import Tabs from "@/components/AdminDashboard/reuseable/Tabs";
import { useGetStudyModeAllContentQuery } from "@/store/features/adminDashboard/ContentResources/MCQ/mcqApi";
import {
  AllContentMCQList,
  ClinicalCaseTreeResponse,
  NotesTreeResponse,
  OsceTreeResponse,
} from "@/store/features/adminDashboard/ContentResources/MCQ/types/allContent";
import {
  ContentType,
  setContentType,
  setUniversalSelectNode,
} from "@/store/features/adminDashboard/staticContent/staticContentSlice";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { RootState } from "@/store/store";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState } from "react";
import ClinicalCaseBank from "../../bank/ClinicalBank/ClinicalCaseBank";
import FlashCardBank from "../../bank/FlashCardBank/FlashCardBank";
import MCQBank from "../../bank/MCQBank/MCQBank";
import NotesBank from "../../bank/NotesBank/NotesBank";
import OSCEBank from "../../bank/OSCEBank/OSCEBank";
import { tabs } from "../../MultipleTap";
import AddSubjectModal from "./AddSubjectModal";

export type SelectedNode = {
  subject: string;
  system: string;
  topic: string;
  subtopic: string;
};

const StudyMode = () => {
  //manage  key
  const dispatch = useAppDispatch();
  const { contentType, contentFor, profileType } = useAppSelector(
    (state: RootState) => state.staticContent,
  );
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SelectedNode>({
    subject: "",
    system: "",
    topic: "",
    subtopic: "",
  });

  const isValidSelection =
    selectedNode.subject.trim() !== "" ||
    selectedNode.system.trim() !== "" ||
    selectedNode.topic.trim() !== "" ||
    selectedNode.subtopic.trim() !== "";

  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 5;

  const queryArg = isValidSelection
    ? {
        key: contentType,
        contentFor,
        profileType,
        subject: selectedNode.subject.trim(),
        system: selectedNode.system.trim(),
        topic: selectedNode.topic.trim(),
        subtopic: selectedNode.subtopic.trim(),
        page: currentPage,
        limit,
      }
    : skipToken;

  const { data: mcqBank, isLoading } = useGetStudyModeAllContentQuery(
    queryArg,
    { refetchOnMountOrArgChange: true },
  );

  const [bankId, setBankId] = useState<string>("");
  const totalPages = mcqBank?.meta?.totalPages || 1;

  const [initialContent, setInitialContent] = useState<TOCItem | null>(null);

  const mcqBankLength = mcqBank?.data?.length === 0;

  const handleOpenSubjectModal = () => {
    setIsSubjectModalOpen(true);
    setInitialContent(null);
  };

  return (
    <div>
      <div className="w-full  flex  items-start gap-6 pb-6">
        <TableContent
          openModal={handleOpenSubjectModal}
          setSelectedNode={(node) => {
            setSelectedNode(node);
            setBankId("");
            dispatch(setUniversalSelectNode(node));
          }}
          selectedNode={selectedNode}
          initialContent={initialContent}
          setInitialContent={setInitialContent}
        />

        <div className="w-full flex flex-col gap-6">
          <div>
            <Tabs
              tabs={tabs}
              active={contentType}
              onChange={(value) =>
                dispatch(setContentType(value as ContentType))
              }
            />
          </div>
          <div>
            {isLoading ? (
              <Spinner />
            ) : mcqBankLength ? (
              <p>No {contentType} found</p>
            ) : (
              <div>
                {contentType === "MCQ" && mcqBank && (
                  <MCQBank
                    mcqBank={mcqBank as AllContentMCQList}
                    bankId={bankId}
                    setBankId={setBankId}
                  />
                )}
                {contentType === "Flashcard" && mcqBank && (
                  <FlashCardBank
                    mcqBank={mcqBank as AllContentMCQList}
                    bankId={bankId}
                    setBankId={setBankId}
                  />
                )}
                {contentType === "ClinicalCase" &&
                  (mcqBank as ClinicalCaseTreeResponse) && (
                    <ClinicalCaseBank
                      mcqBank={mcqBank as ClinicalCaseTreeResponse}
                      bankId={bankId}
                      setBankId={setBankId}
                    />
                  )}
                {contentType === "OSCE" && (mcqBank as OsceTreeResponse) && (
                  <OSCEBank
                    mcqBank={mcqBank as OsceTreeResponse}
                    bankId={bankId}
                    setBankId={setBankId}
                  />
                )}
                {contentType === "Notes" && (mcqBank as NotesTreeResponse) && (
                  <NotesBank
                    mcqBank={mcqBank as NotesTreeResponse}
                    bankId={bankId}
                    setBankId={setBankId}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isSubjectModalOpen && (
        <AddSubjectModal
          onClose={() => setIsSubjectModalOpen(false)}
          initialContent={initialContent}
        />
      )}

      {totalPages > 1 && mcqBank?.data.length !== 0 && bankId === "" && (
        <div className="my-10 w-full flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default StudyMode;
