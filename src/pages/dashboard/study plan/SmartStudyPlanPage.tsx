import { useEffect, useRef } from "react";
import MedicalStudyGoalTracker from "@/components/dashboard/goal/MedicalStudyGoalTracker";
import StudyPlanListSection from "./StudyPlanListSection";
import { useGetGoalQuery } from "@/store/features/goal/goal.api";
import {
  useCreateStudyPlanMutation,
  useGetStudyPlanQuery,
} from "@/store/features/studyPlan/studyPlan.api";
import { goalToStudyPlanTopics } from "@/utils/goalToStudyPlanTopics";
import { useGetMCQBankTreeQuery } from "@/store/features/MCQBank/MCQBank.api";
import type { Subject } from "@/components/dashboard/goal/type";

export default function SmartStudyPlanPage() {
  const { data: goalRes } = useGetGoalQuery({});
  const goal = goalRes?.data?.[0];

  const { data: treeData } = useGetMCQBankTreeQuery({});
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

  const { data: plannerPlansRes } = useGetStudyPlanQuery({
    created_from: "smart_study_planner",
    page: 1,
    limit: 1,
  });
  const hasPlannerPlan = (plannerPlansRes?.data?.length ?? 0) > 0;

  const [createStudyPlan] = useCreateStudyPlanMutation();
  const didAutoGenerate = useRef(false);

  useEffect(() => {
    if (didAutoGenerate.current) return;
    if (!goal) return;
    if (!availableSubjects.length) return;
    if (hasPlannerPlan) return;

    const topics = goalToStudyPlanTopics(goal?.selectedSubjects, availableSubjects);
    if (!topics.length) return;

    didAutoGenerate.current = true;
    createStudyPlan({
      exam_name: goal.goalName,
      start_date: String(goal.startDate || "").split("T")[0],
      exam_date: String(goal.endDate || "").split("T")[0],
      daily_study_time: Number(goal.studyHoursPerDay || 0),
      exam_type: "",
      topics,
      created_from: "smart_study_planner",
    }).catch(() => {
      // best-effort: avoid infinite loops; user can update planner to retry
    });
  }, [goal, availableSubjects.length, hasPlannerPlan, createStudyPlan]);

  return (
    <div className="my-6 md:my-10">
      <MedicalStudyGoalTracker />
      <div className="mt-8">
        <StudyPlanListSection
          title="Your Study Plans"
          description="Generated plans based on your Smart Study Planner goal."
          showCreateButton={false}
          queryParams={{ created_from: "smart_study_planner" }}
          wrapperClassName="px-1 md:px-2"
        />
      </div>
    </div>
  );
}

