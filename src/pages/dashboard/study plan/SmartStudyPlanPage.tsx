import MedicalStudyGoalTracker from "@/components/dashboard/goal/MedicalStudyGoalTracker";
import { useGetGoalQuery } from "@/store/features/goal/goal.api";
import { useCreateStudyPlanMutation, useGetStudyPlanQuery } from "@/store/features/studyPlan/studyPlan.api";
import StudyPlanView, { StudyPlanData } from "./StudyPlanView";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SmartStudyPlanPage() {
  const { data: goalData, isLoading: isGoalLoading } = useGetGoalQuery({});
  const goal = goalData?.data?.[0];

  const { data: plansData, isLoading: isPlansLoading } = useGetStudyPlanQuery(
    goal?._id ? { plan_type: "smart", goalId: goal._id } : { plan_type: "smart" },
    { skip: !goal?._id },
  ) as any;

  const [createStudyPlan, { isLoading: isGenerating }] = useCreateStudyPlanMutation();

  const latestPlan: StudyPlanData | undefined = plansData?.data?.[0];

  const buildTopicsFromGoal = (): any[] => {
    const selectedSubjects = goal?.selectedSubjects ?? [];
    return selectedSubjects.flatMap((sub: any) =>
      (sub.systems ?? []).flatMap((sys: any) =>
        (sys.topics ?? []).flatMap((t: any) => {
          const sts = Array.isArray(t.subTopicNames) ? t.subTopicNames : [];
          if (sts.length > 0) {
            return sts.map((st: string) => ({
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
  };

  const handleGenerate = async () => {
    if (!goal?._id) return;
    const topics = buildTopicsFromGoal();
    if (!topics.length) {
      toast.error("Please select at least one topic in your goal.");
      return;
    }
    try {
      await createStudyPlan({
        exam_name: goal.goalName,
        start_date: goal.startDate?.split("T")[0] ?? goal.startDate,
        exam_date: goal.endDate?.split("T")[0] ?? goal.endDate,
        daily_study_time: Number(goal.studyHoursPerDay),
        exam_type: "",
        plan_type: "smart",
        goalId: goal._id,
        topics,
      }).unwrap();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to generate plan.");
    }
  };

  return (
    <div className="my-6 md:my-10 space-y-8">
      <MedicalStudyGoalTracker />

      {goal?._id && !latestPlan && !isGoalLoading && !isPlansLoading && (
        <div className="px-2">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">No study plan generated yet</div>
              <div className="text-sm text-slate-500">Generate a day-by-day plan based on your Smart Study Planner goal.</div>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating} className="cursor-pointer">
              {isGenerating ? "Generating..." : "Generate Plan"}
            </Button>
          </div>
        </div>
      )}

      {goal?._id && (
        <div className="px-2">
          <StudyPlanView
            studyPlan={latestPlan}
            isLoading={Boolean(isGoalLoading || isPlansLoading || isGenerating)}
            backTo="/dashboard/smart-study-plan"
            emptyTitle="No plan yet"
            emptyDescription="Create or update your Smart Study Planner goal, then generate a plan."
          />
        </div>
      )}
    </div>
  );
}

