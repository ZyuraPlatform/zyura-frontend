/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { SelectedSubject, Subject, FormData as GoalFormData } from "./type";
import { GoalModal, Step1, Step2, Step3 } from "./GoalModal";
import { GoalEmptyState } from "./GoalEmptyState";
import { GoalDashboard } from "./GoalDashboard";
import {
  useCreateGoalMutation,
  useGetGoalQuery,
  useUpdateGoalMutation,
} from "@/store/features/goal/goal.api";
import { useCreateStudyPlanMutation } from "@/store/features/studyPlan/studyPlan.api";
import { toast } from "sonner";
import GlobalLoader from "@/common/GlobalLoader";
import { useGetMCQBankTreeQuery } from "@/store/features/MCQBank/MCQBank.api";

// Main Component
const MedicalStudyGoalTracker: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  // const [goal, setGoal] = useState<Goal | null>(null);

  const [createGoal, { isLoading: isCreating }] = useCreateGoalMutation();
  const [updateGoal, { isLoading: isUpdating }] = useUpdateGoalMutation();
  const [createStudyPlan] = useCreateStudyPlanMutation();
  const { data, isLoading } = useGetGoalQuery({});

  const { data: treeData, isLoading: isTreeLoading } = useGetMCQBankTreeQuery(
    {}
  );

  const availableSubjects: Subject[] =
    treeData?.data?.map((subject: any) => ({
      name: subject.subjectName,
      systems: subject.systems.map((system: any) => ({
        name: system.name,
        topics: system.topics.map((topic: any) => ({
          topicName: topic.topicName,
          subTopics: topic.subTopics || [],
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

  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>(
    []
  );

  const handleSubjectToggle = (subjectName: string): void => {
    const existingIndex = selectedSubjects.findIndex(
      (s) => s.subjectName === subjectName
    );

    if (existingIndex >= 0) {
      setSelectedSubjects(
        selectedSubjects.filter((s) => s.subjectName !== subjectName)
      );
    } else {
      setSelectedSubjects([
        ...selectedSubjects,
        { subjectName, systemNames: [], fullSubject: false },
      ]);
    }
  };

  const handleFullSubjectToggle = (subjectName: string): void => {
    const subject = availableSubjects.find((s) => s.name === subjectName);
    if (!subject) return;

    const existingIndex = selectedSubjects.findIndex(
      (s) => s.subjectName === subjectName
    );

    if (existingIndex >= 0) {
      const updated = [...selectedSubjects];
      const currentFullSubject = updated[existingIndex].fullSubject;

      if (currentFullSubject) {
        updated[existingIndex] = {
          subjectName,
          systemNames: [],
          fullSubject: false,
        };
      } else {
        updated[existingIndex] = {
          subjectName,
          systemNames: subject.systems.map((s) => s.name),
          fullSubject: true,
        };
      }
      setSelectedSubjects(updated);
    }
  };

 const handleSystemToggle = (
  subjectName: string,
  systemName: string,
): void => {
  const subject = availableSubjects.find((s) => s.name === subjectName);
  if (!subject) return;

  const existingIndex = selectedSubjects.findIndex(
    (s) => s.subjectName === subjectName,
  );

  if (existingIndex === -1) return;

  const updated = [...selectedSubjects];

  const systemIndex = (updated[existingIndex].systems ?? []).findIndex(
    (s) => s.systemName === systemName,
  );

  if (systemIndex >= 0) {
    // REMOVE system
    updated[existingIndex].systemNames = (
      updated[existingIndex].systemNames ?? []
    ).filter((s) => s !== systemName);

    updated[existingIndex].systems = (
      updated[existingIndex].systems ?? []
    ).filter((s) => s.systemName !== systemName);
  } else {
    // ADD system
    updated[existingIndex].systemNames = [
      ...(updated[existingIndex].systemNames ?? []),
      systemName,
    ];

    updated[existingIndex].systems = [
      ...(updated[existingIndex].systems ?? []),
      {
        systemName,
        topics: [],
        fullSystem: false,
      },
    ];
  }

  setSelectedSubjects(updated);
};

  const handleFullSystemToggle = (
    subjectName: string,
    systemName: string,
  ): void => {
    const subject = availableSubjects.find((s) => s.name === subjectName);
    const system = subject?.systems.find((s) => s.name === systemName);
    if (!system) return;

    setSelectedSubjects(
      selectedSubjects.map((s) => {
        if (s.subjectName !== subjectName) return s;
        return {
          ...s,
          systems: (s.systems ?? []).map((sys) => {
            if (sys.systemName !== systemName) return sys;
            if (sys.fullSystem)
              return { ...sys, fullSystem: false, topics: [] };
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
      }),
    );
  };

  const handleTopicToggle = (
    subjectName: string,
    systemName: string,
    topicName: string,
  ): void => {
    setSelectedSubjects(
      selectedSubjects.map((s) => {
        if (s.subjectName !== subjectName) return s;
        return {
          ...s,
          systems: (s.systems ?? []).map((sys) => {
            if (sys.systemName !== systemName) return sys;
            const exists = sys.topics.find((t) => t.topicName === topicName);
            if (exists) {
              return {
                ...sys,
                fullSystem: false,
                topics: sys.topics.filter((t) => t.topicName !== topicName),
              };
            }
            return {
              ...sys,
              topics: [
                ...sys.topics,
                { topicName, subTopicNames: [], fullTopic: false },
              ],
            };
          }),
        };
      }),
    );
  };

  const handleFullTopicToggle = (
    subjectName: string,
    systemName: string,
    topicName: string,
  ): void => {
    const subject = availableSubjects.find((s) => s.name === subjectName);
    const system = subject?.systems.find((s) => s.name === systemName);
    const topic = system?.topics.find((t) => t.topicName === topicName);
    if (!topic) return;

    setSelectedSubjects(
      selectedSubjects.map((s) => {
        if (s.subjectName !== subjectName) return s;
        return {
          ...s,
          systems: (s.systems ?? []).map((sys) => {
            if (sys.systemName !== systemName) return sys;
            return {
              ...sys,
              topics: sys.topics.map((t) => {
                if (t.topicName !== topicName) return t;
                if (t.fullTopic)
                  return { ...t, fullTopic: false, subTopicNames: [] };
                return {
                  ...t,
                  fullTopic: true,
                  subTopicNames: [...topic.subTopics],
                };
              }),
            };
          }),
        };
      }),
    );
  };

  const handleSubTopicToggle = (
    subjectName: string,
    systemName: string,
    topicName: string,
    subTopicName: string,
  ): void => {
    setSelectedSubjects(
      selectedSubjects.map((s) => {
        if (s.subjectName !== subjectName) return s;
        return {
          ...s,
          systems: (s.systems ?? []).map((sys) => {
            if (sys.systemName !== systemName) return sys;
            return {
              ...sys,
              topics: sys.topics.map((t) => {
                if (t.topicName !== topicName) return t;
                const has = t.subTopicNames.includes(subTopicName);
                return {
                  ...t,
                  fullTopic: has ? false : t.fullTopic,
                  subTopicNames: has
                    ? t.subTopicNames.filter((st) => st !== subTopicName)
                    : [...t.subTopicNames, subTopicName],
                };
              }),
            };
          }),
        };
      }),
    );
  };

  const calculateDuration = (): number => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalStudyHours = (): number => {
    return calculateDuration() * formData.studyHoursPerDay;
  };

  const calculateHoursPerSystem = (): string => {
    const totalSystems = selectedSubjects.reduce(
      (total, subject) => total + (subject.systems?.length ?? 0),
      0,
    );
    if (totalSystems === 0) return "0";
    return (calculateTotalStudyHours() / totalSystems).toFixed(1);
  };

  const handleCreateGoal = async () => {
    const goalDataToSend = {
      goalName: formData.goalName,
      studyHoursPerDay: Number(formData.studyHoursPerDay),
      startDate: formData.startDate,
      endDate: formData.endDate,
      selectedSubjects: selectedSubjects.map((s) => ({
        subjectName: s.subjectName,
        systemNames: s.systemNames,
        systems: s.systems ?? [],
        fullSubject: s.fullSubject ?? false,
      })),
    };

    try {
      const savedGoal: any = isEditMode
        ? await updateGoal(goalDataToSend).unwrap()
        : await createGoal(goalDataToSend).unwrap();

      const goalId =
        savedGoal?.data?._id ||
        savedGoal?._id ||
        savedGoal?.data?.id ||
        savedGoal?.id;

      // Build study plan topics from the selectedSubjects hierarchy.
      const topics = (selectedSubjects ?? []).flatMap((sub) =>
        (sub.systems ?? []).flatMap((sys) =>
          (sys.topics ?? []).flatMap((t) => {
            const sts = Array.isArray(t.subTopicNames) ? t.subTopicNames : [];
            if (sts.length > 0) {
              return sts.map((st) => ({
                subject: sub.subjectName,
                system: sys.systemName,
                topic: t.topicName,
                subtopic: st,
              }));
            }
            return [
              {
                subject: sub.subjectName,
                system: sys.systemName,
                topic: t.topicName,
                subtopic: "",
              },
            ];
          }),
        ),
      );

      if (!topics.length) {
        toast.error("Please select at least one topic before generating a plan.");
      } else {
        await createStudyPlan({
          exam_name: formData.goalName,
          start_date: formData.startDate,
          exam_date: formData.endDate,
          daily_study_time: Number(formData.studyHoursPerDay),
          exam_type: "",
          plan_type: "smart",
          goalId,
          topics,
        }).unwrap();
      }
    } catch (error: any) {
      console.error("Goal operation error:", error);
      toast.error(
        error?.data?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } goal. Please try again ❌`
      );
    }

    handleCloseModal();
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setCurrentStep(1);
    setIsEditMode(false);
    setFormData({
      goalName: "",
      studyHoursPerDay: 0,
      startDate: "",
      endDate: "",
    });
    setSelectedSubjects([]);
  };

  const handleChangeGoal = (): void => {
    if (apiGoal) {
      // Pre-populate form with existing goal data
      setIsEditMode(true);
      setFormData({
        goalName: apiGoal.goalName,
        studyHoursPerDay: apiGoal.studyHoursPerDay,
        startDate: apiGoal.startDate.split("T")[0], // Convert to YYYY-MM-DD format
        endDate: apiGoal.endDate.split("T")[0],
      });

      // Pre-populate selected subjects
      setSelectedSubjects(
        apiGoal.selectedSubjects.map((subject: any) => {
          const availableSubject = availableSubjects.find(
            (s) => s.name === subject.subjectName,
          );

          const systemNames = subject.systemNames ?? [];
          const fullSubject = subject.fullSubject || false;

          // If API already has full systems data with topics, use it
          if (subject.systems && subject.systems.length > 0) {
            return {
              subjectName: subject.subjectName,
              systemNames,
              systems: subject.systems,
              fullSubject,
            };
          }

          // Reconstruct systems from availableSubjects using systemNames
          const systems = systemNames
            .map((sysName: string) => {
              const system = availableSubject?.systems.find(
                (s) => s.name === sysName,
              );
              if (!system) return null;
              return {
                systemName: sysName,
                fullSystem: false,
                topics: system.topics.map((t) => ({
                  topicName: t.topicName,
                  fullTopic: true,
                  subTopicNames: [...t.subTopics],
                })),
              };
            })
            .filter(Boolean);

          return {
            subjectName: subject.subjectName,
            systemNames,
            systems,
            fullSubject,
          };
        }),
      );
    }
    setShowModal(true);
  };

  if (isLoading || isTreeLoading)
    return (
      <div>
        <GlobalLoader />
      </div>
    );

  return (
    <div className="bg-gray-50 mb-12">
      <div>
        {!apiGoal ? (
          <GoalEmptyState onSetGoal={() => setShowModal(true)} />
        ) : (
          <GoalDashboard goal={apiGoal} onChangeGoal={handleChangeGoal} />
        )}

        <GoalModal
          showModal={showModal}
          currentStep={currentStep}
          onClose={handleCloseModal}
          isEditMode={isEditMode}
        >
          {currentStep === 1 && (
            <Step1
              formData={formData}
              onFormDataChange={setFormData}
              onNext={() => setCurrentStep(2)}
              onCancel={handleCloseModal}
            />
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
    </div>
  );
};

export default MedicalStudyGoalTracker;
