// MedicalStudyGoalTracker.tsx — full replacement

import React, { useState } from "react";
import { SelectedSubject, Subject, FormData as GoalFormData } from "./type";
import { GoalModal, Step1, Step2, Step3 } from "./GoalModal";
import { GoalEmptyState } from "./GoalEmptyState";
import { GoalDashboard } from "./GoalDashboard";
import { useCreateGoalMutation, useGetGoalQuery, useUpdateGoalMutation } from "@/store/features/goal/goal.api";
import { toast } from "sonner";
import GlobalLoader from "@/common/GlobalLoader";
import { useGetMCQBankTreeQuery } from "@/store/features/MCQBank/MCQBank.api";

const MedicalStudyGoalTracker: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);

  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
  const { data, isLoading } = useGetGoalQuery({});
  const { data: treeData, isLoading: isTreeLoading } = useGetMCQBankTreeQuery({});

  // Build availableSubjects with FULL hierarchy (systems → topics → subtopics)
  const availableSubjects: Subject[] =
    treeData?.data?.map((subject: any) => ({
      name: subject.subjectName,
      systems: subject.systems.map((system: any) => ({
        name: system.name,
        topics: (system.topics ?? []).map((topic: any) => ({
          topicName: topic.topicName,
          subTopics: topic.subTopics ?? [],
        })),
      })),
    })) || [];

  const apiGoal = data?.data?.[0];

  const [formData, setFormData] = useState<GoalFormData>({
    goalName: "",
    studyHoursPerDay: 0,
    startDate: "",
    endDate: "",
  });
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([]);

  // ─── Subject toggle ────────────────────────────────────────────────────
  const handleSubjectToggle = (subjectName: string) => {
    const exists = selectedSubjects.find((s) => s.subjectName === subjectName);
    if (exists) {
      setSelectedSubjects(selectedSubjects.filter((s) => s.subjectName !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, { subjectName, systems: [], fullSubject: false }]);
    }
  };

  // ─── Full subject toggle ───────────────────────────────────────────────
  const handleFullSubjectToggle = (subjectName: string) => {
    const subject = availableSubjects.find((s) => s.name === subjectName);
    if (!subject) return;
    setSelectedSubjects(selectedSubjects.map((s) => {
      if (s.subjectName !== subjectName) return s;
      if (s.fullSubject) return { ...s, systems: [], fullSubject: false };
      // Select all systems, all topics, all subtopics
      return {
        ...s,
        fullSubject: true,
        systems: subject.systems.map((sys) => ({
          systemName: sys.name,
          fullSystem: true,
          topics: sys.topics.map((t) => ({
            topicName: t.topicName,
            fullTopic: true,
            subTopicNames: [...t.subTopics],
          })),
        })),
      };
    }));
  };

  // ─── System toggle ─────────────────────────────────────────────────────
  const handleSystemToggle = (subjectName: string, systemName: string) => {
    setSelectedSubjects(selectedSubjects.map((s) => {
      if (s.subjectName !== subjectName) return s;
      const exists = s.systems.find((sys) => sys.systemName === systemName);
      if (exists) {
        return { ...s, systems: s.systems.filter((sys) => sys.systemName !== systemName) };
      }
      return {
        ...s,
        systems: [...s.systems, { systemName, topics: [], fullSystem: false }],
      };
    }));
  };

  // ─── Full system toggle ────────────────────────────────────────────────
  const handleFullSystemToggle = (subjectName: string, systemName: string) => {
    const subject = availableSubjects.find((s) => s.name === subjectName);
    const system = subject?.systems.find((s) => s.name === systemName);
    if (!system) return;

    setSelectedSubjects(selectedSubjects.map((s) => {
      if (s.subjectName !== subjectName) return s;
      return {
        ...s,
        systems: s.systems.map((sys) => {
          if (sys.systemName !== systemName) return sys;
          if (sys.fullSystem) return { ...sys, fullSystem: false, topics: [] };
          return {
            ...sys,
            fullSystem: true,
            topics: system.topics.map((t) => ({
              topicName: t.topicName,
              fullTopic: true,
              subTopicNames: [...t.subTopics],
            })),
          };
        }),
      };
    }));
  };

  // ─── Topic toggle ──────────────────────────────────────────────────────
  const handleTopicToggle = (subjectName: string, systemName: string, topicName: string) => {
    setSelectedSubjects(selectedSubjects.map((s) => {
      if (s.subjectName !== subjectName) return s;
      return {
        ...s,
        systems: s.systems.map((sys) => {
          if (sys.systemName !== systemName) return sys;
          const exists = sys.topics.find((t) => t.topicName === topicName);
          if (exists) {
            return { ...sys, topics: sys.topics.filter((t) => t.topicName !== topicName) };
          }
          return {
            ...sys,
            topics: [...sys.topics, { topicName, subTopicNames: [], fullTopic: false }],
          };
        }),
      };
    }));
  };

  // ─── Full topic toggle ─────────────────────────────────────────────────
  const handleFullTopicToggle = (subjectName: string, systemName: string, topicName: string) => {
    const subject = availableSubjects.find((s) => s.name === subjectName);
    const system = subject?.systems.find((s) => s.name === systemName);
    const topic = system?.topics.find((t) => t.topicName === topicName);
    if (!topic) return;

    setSelectedSubjects(selectedSubjects.map((s) => {
      if (s.subjectName !== subjectName) return s;
      return {
        ...s,
        systems: s.systems.map((sys) => {
          if (sys.systemName !== systemName) return sys;
          return {
            ...sys,
            topics: sys.topics.map((t) => {
              if (t.topicName !== topicName) return t;
              if (t.fullTopic) return { ...t, fullTopic: false, subTopicNames: [] };
              return { ...t, fullTopic: true, subTopicNames: [...topic.subTopics] };
            }),
          };
        }),
      };
    }));
  };

  // ─── Sub-topic toggle ──────────────────────────────────────────────────
  const handleSubTopicToggle = (
    subjectName: string, systemName: string, topicName: string, subTopicName: string
  ) => {
    setSelectedSubjects(selectedSubjects.map((s) => {
      if (s.subjectName !== subjectName) return s;
      return {
        ...s,
        systems: s.systems.map((sys) => {
          if (sys.systemName !== systemName) return sys;
          return {
            ...sys,
            topics: sys.topics.map((t) => {
              if (t.topicName !== topicName) return t;
              const has = t.subTopicNames.includes(subTopicName);
              return {
                ...t,
                subTopicNames: has
                  ? t.subTopicNames.filter((st) => st !== subTopicName)
                  : [...t.subTopicNames, subTopicName],
              };
            }),
          };
        }),
      };
    }));
  };

  // ─── Calculations ──────────────────────────────────────────────────────
  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const diff = new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const calculateTotalStudyHours = () => calculateDuration() * formData.studyHoursPerDay;
  const calculateHoursPerSystem = () => {
    const totalSystems = selectedSubjects.reduce((t, s) => t + s.systems.length, 0);
    if (totalSystems === 0) return "0";
    return (calculateTotalStudyHours() / totalSystems).toFixed(1);
  };

  // ─── Create / Update ───────────────────────────────────────────────────
  const handleCreateGoal = async () => {
    const goalDataToSend = {
      goalName: formData.goalName,
      studyHoursPerDay: Number(formData.studyHoursPerDay),
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedSubjects: selectedSubjects.map((s) => ({
        subjectName: s.subjectName,
        systemNames: s.systems.map((sys) => sys.systemName), // ← keep backward compat
        systems: s.systems, // ← full hierarchy
        fullSubject: s.fullSubject,
      })),
    };

    try {
      if (isEditMode) {
        await updateGoal(goalDataToSend).unwrap();
      } else {
        await createGoal(goalDataToSend).unwrap();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditMode ? "update" : "create"} goal ❌`);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setIsEditMode(false);
    setFormData({ goalName: "", studyHoursPerDay: 0, startDate: "", endDate: "" });
    setSelectedSubjects([]);
  };

  const handleChangeGoal = () => {
    if (apiGoal) {
      setIsEditMode(true);
      setFormData({
        goalName: apiGoal.goalName,
        studyHoursPerDay: apiGoal.studyHoursPerDay,
        startDate: apiGoal.startDate.split("T")[0],
        endDate: apiGoal.endDate.split("T")[0],
      });
      // Restore full hierarchy if available, fallback to old systemNames format
      setSelectedSubjects(
        apiGoal.selectedSubjects.map((subject: any) => ({
          subjectName: subject.subjectName,
          fullSubject: subject.fullSubject ?? false,
          systems: subject.systems ?? subject.systemNames?.map((sn: string) => ({
            systemName: sn,
            fullSystem: false,
            topics: [],
          })) ?? [],
        }))
      );
    }
    setShowModal(true);
  };

  if (isLoading || isTreeLoading) return <div><GlobalLoader /></div>;

  return (
    <div className="bg-gray-50 mb-12">
      {!apiGoal ? (
        <GoalEmptyState onSetGoal={() => setShowModal(true)} />
      ) : (
        <GoalDashboard goal={apiGoal} onChangeGoal={handleChangeGoal} />
      )}

      <GoalModal showModal={showModal} currentStep={currentStep} onClose={handleCloseModal} isEditMode={isEditMode}>
        {currentStep === 1 && (
          <Step1 formData={formData} onFormDataChange={setFormData}
            onNext={() => setCurrentStep(2)} onCancel={handleCloseModal} />
        )}
        {currentStep === 2 && (
          <Step2
            availableSubjects={availableSubjects}
            selectedSubjects={selectedSubjects}
            onSubjectToggle={handleSubjectToggle}
            onFullSubjectToggle={handleFullSubjectToggle}
            onSystemToggle={handleSystemToggle}
            onFullSystemToggle={handleFullSystemToggle}
            onTopicToggle={handleTopicToggle}
            onFullTopicToggle={handleFullTopicToggle}
            onSubTopicToggle={handleSubTopicToggle}
            onPrevious={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
          />
        )}
        {currentStep === 3 && (
          <Step3
            formData={formData}
            selectedSubjects={selectedSubjects}
            availableSubjects={availableSubjects}
            calculateDuration={calculateDuration}
            calculateTotalStudyHours={calculateTotalStudyHours}
            calculateHoursPerSystem={calculateHoursPerSystem}
            onPrevious={() => setCurrentStep(2)}
            onCreate={handleCreateGoal}
            isEditMode={isEditMode}
            isLoading={isCreating || isUpdating}
          />
        )}
      </GoalModal>
    </div>
  );
};

export default MedicalStudyGoalTracker;