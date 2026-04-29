import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, XCircle, Clock, MinusCircle, MessageSquare } from "lucide-react";
import { Link, useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import DashboardHeading from "@/components/reusable/DashboardHeading";
import {
  useGetSingleStudyPlanQuery,
  useSaveStudyPlanProgressMutation,
  useCancelStudyPlanMutation,
  useDeleteStudyPlanMutation,
} from "@/store/features/studyPlan/studyPlan.api";
import GlobalLoader2 from "@/common/GlobalLoader2";
import { toast } from "sonner";
import StudyPlanChatPanel from "./StudyPlanChatPanel";

interface HourlyBreakdown {
  task_type: string;
  duration_hours: number;
  duration_minutes: number;
  suggest_content: { contentId: string; limit: number };
  isCompleted: boolean;
  description: string;
}

interface DailyPlan {
  day_number: number;
  date: string;
  total_hours: number;
  topics: string[];
  hourly_breakdown: HourlyBreakdown[];
  isCompleted?: boolean;
}

interface StudyPlanData {
  _id: string;
  title?: string;
  thread_id?: string;
  created_from?: "smart_study" | "smart_study_planner";
  plan_summary: string;
  total_days: number;
  daily_plan: DailyPlan[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Parses YYYY-MM-DD safely without timezone shift ──────────────────────
const parseLocalDate = (dateStr: string): Date => {
  const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  const [y, m, d] = clean.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getTodayLocal = (): Date => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

export default function WeeklyPlan() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useGetSingleStudyPlanQuery(id as string, {
    skip: !id,
  });
  const [saveProgress, { isLoading: isSaving }] = useSaveStudyPlanProgressMutation();
  const [cancelPlan] = useCancelStudyPlanMutation();
  const [deletePlan] = useDeleteStudyPlanMutation();

  const planFromState = location.state?.plan as StudyPlanData | undefined;
  const studyPlan: StudyPlanData | undefined = data?.data || planFromState;
  const backPath =
    studyPlan?.created_from === "smart_study_planner"
      ? "/dashboard/smart-study-plan"
      : "/dashboard/smart-study";

  const showChat = searchParams.get("chat") === "1";
  const hasPlanChat =
    studyPlan?.created_from === "smart_study_planner" &&
    Boolean(studyPlan?.thread_id);

  const planHeading = useMemo(
    () => studyPlan?.title?.trim() || studyPlan?.plan_summary || "Study plan",
    [studyPlan?.title, studyPlan?.plan_summary],
  );

  const toggleChat = () => {
    const next = new URLSearchParams(searchParams);
    if (showChat) {
      next.delete("chat");
    } else {
      next.set("chat", "1");
    }
    setSearchParams(next, { replace: true });
  };

  const today = getTodayLocal();

  const handleStart = async (
    taskType: string,
    contentId: string,
    dayNumber: number
  ) => {
    if (!contentId) {
      toast.warning("Content is not yet assigned to this task.");
      return;
    }

    // ─── Save progress when user starts a task ──────────────────────────
    try {
      await saveProgress({
        planId: studyPlan?._id,
        day: dayNumber,
        suggest_content: contentId,
      }).unwrap();
    } catch {
      // Non-blocking — navigate anyway
    }

    const type = taskType.toLowerCase();
    const state = { planId: studyPlan?._id, day: dayNumber, suggest_content: contentId, from: "weekly-plan" };

    if (type === "mcqs" || type === "mcq") {
      navigate(`/dashboard/practice-mcq/${contentId}`, { state });
    } else if (type === "flashcards" || type === "flashcard") {
      navigate(`/dashboard/solve-flash-card/${contentId}`, { state });
    } else if (type === "clinical case" || type === "clinical_case") {
      navigate(`/dashboard/clinical-case/${contentId}`, { state });
    } else if (type === "osce") {
      navigate(`/dashboard/practice-with-checklist/${contentId}`, { state });
    } else if (type === "notes" || type === "note") {
      navigate(`/dashboard/notes/${contentId}`, { state });
    } else {
      toast.warning("Unknown task type: " + taskType);
    }
  };

  const handleCancel = async () => {
    if (!studyPlan?._id) return;
    try {
      await cancelPlan(studyPlan._id).unwrap();
      toast.success("Plan cancelled.");
      navigate(backPath);
    } catch {
      toast.error("Failed to cancel plan.");
    }
  };

  const handleDelete = async () => {
    if (!studyPlan?._id) return;
    try {
      await deletePlan(studyPlan._id).unwrap();
      toast.success("Plan deleted.");
      navigate(backPath);
    } catch {
      toast.error("Failed to delete plan.");
    }
  };

  if ((isLoading || !id) && !planFromState) return <GlobalLoader2 />;

  if (!studyPlan) {
    return (
      <div className="mb-10 bg-slate-50">
        <div className="flex items-center gap-3">
          <Link to={backPath} className="mb-7">
            <ArrowLeft />
          </Link>
          <DashboardHeading
            title="Study Plan Not Found"
            titleSize="text-xl"
            description="The requested study plan could not be found."
            className="mt-12 mb-12 space-y-1"
          />
        </div>
      </div>
    );
  }

  // ─── Progress stats ────────────────────────────────────────────────────
  const totalTasks = studyPlan.daily_plan.reduce(
    (sum, d) => sum + d.hourly_breakdown.length, 0
  );
  const completedTasks = studyPlan.daily_plan.reduce(
    (sum, d) => sum + d.hourly_breakdown.filter((t) => t.isCompleted).length, 0
  );
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="mb-10 bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to={backPath} className="mb-7">
            <ArrowLeft />
          </Link>
          <DashboardHeading
            title={planHeading}
            titleSize="text-xl"
            description={`${studyPlan.total_days} days · ${completedTasks}/${totalTasks} tasks done`}
            className="mt-12 mb-12 space-y-1"
          />
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {hasPlanChat && (
            <Button
              variant={showChat ? "default" : "outline"}
              size="sm"
              onClick={toggleChat}
              className="gap-1"
            >
              <MessageSquare className="w-4 h-4" />
              {showChat ? "Hide chat" : "Plan chat"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancel}
            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            Cancel Plan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Delete Plan
          </Button>
        </div>
      </div>

      <div
        className={
          showChat && hasPlanChat
            ? "grid grid-cols-1 lg:grid-cols-[1fr_min(360px,100%)] gap-6 items-start"
            : ""
        }
      >
      <div className="min-w-0">
      {/* Overall progress bar */}
      <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span className="font-semibold">{progressPct}%</span>
        </div>
        <div className="bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-0 bg-transparent shadow-none">
          <CardHeader className="flex items-center justify-between mb-5">
            <h2 className="text-xl text-[#0A0A0A] font-semibold">Your Plan</h2>
          </CardHeader>

          <CardContent>
            {/* Day status strip */}
            <div className="grid grid-cols-7 gap-2 mb-10">
              {studyPlan.daily_plan.map((dayPlan) => {
                const planDate = parseLocalDate(dayPlan.date);
                const isToday = planDate.getTime() === today.getTime();
                const isPast = planDate.getTime() < today.getTime();

                let statusIcon;
                let colorClass = "";

                if (dayPlan.isCompleted) {
                  statusIcon = <CheckCircle className="w-4 h-4" />;
                  colorClass = "text-green-600 border-green-500 bg-green-50";
                } else if (isToday) {
                  statusIcon = <Clock className="w-4 h-4" />;
                  colorClass = "text-yellow-500 border-yellow-400 bg-yellow-50";
                } else if (isPast) {
                  statusIcon = <XCircle className="w-4 h-4" />;
                  colorClass = "text-red-500 border-red-400 bg-red-50";
                } else {
                  statusIcon = <MinusCircle className="w-4 h-4" />;
                  colorClass = "text-gray-400 border-gray-300 bg-gray-50";
                }

                return (
                  <div key={dayPlan.day_number} className="flex flex-col items-center text-sm font-medium">
                    <span className="text-xs mb-1">D{dayPlan.day_number}</span>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full border ${colorClass}`}>
                      {statusIcon}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed plan */}
            <div className="border border-slate-300 p-7 rounded-[8px] bg-white shadow">
              <div className="flex justify-between items-center mb-7">
                <p>Plan Overview</p>
                <p className={`text-white px-3 py-1 text-sm rounded capitalize
                  ${studyPlan.status === "completed" ? "bg-blue-600" :
                    studyPlan.status === "cancelled" ? "bg-red-500" : "bg-green-600"}`}>
                  {studyPlan.status.replace("_", " ")}
                </p>
              </div>

              <div className="space-y-6">
                {studyPlan.daily_plan.map((dayPlan) => {
                  const planDate = parseLocalDate(dayPlan.date);
                  const isToday = planDate.getTime() === today.getTime();
                  const isPast = planDate.getTime() < today.getTime();
                  const isFuture = planDate.getTime() > today.getTime();

                  let sectionBg = "bg-white border-slate-300";
                  if (dayPlan.isCompleted) sectionBg = "bg-green-50 border-green-200";
                  else if (isToday) sectionBg = "bg-yellow-50 border-yellow-200";
                  else if (isPast) sectionBg = "bg-red-50 border-red-200";

                  return (
                    <div key={dayPlan.day_number} className={`space-y-3 border p-4 rounded-[8px] ${sectionBg}`}>
                      <h3 className="text-lg font-semibold">
                        Day {dayPlan.day_number} –{" "}
                        {planDate.toLocaleDateString("en-GB", {
                          day: "2-digit", month: "short", year: "numeric",
                        })}
                        {isToday && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">Today</span>}
                      </h3>

                      {dayPlan.hourly_breakdown.length > 0 ? (
                        <div className="space-y-3">
                          {dayPlan.hourly_breakdown.map((session, idx) => (
                            <div
                              key={idx}
                              className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-md border border-slate-300 ${
                                session.isCompleted ? "bg-green-100 border-green-200" : "bg-white"
                              }`}
                            >
                              <div className="mb-2 sm:mb-0">
                                <h4 className="font-semibold text-gray-900 text-base">
                                  {session.description}
                                </h4>
                                <p className="text-sm text-gray-500 mt-0.5">
                                  {[
                                    session.task_type,
                                    session.duration_hours && `${session.duration_hours}h`,
                                    session.duration_minutes && `${session.duration_minutes}m`,
                                  ].filter(Boolean).join(" • ")}
                                </p>
                              </div>

                              <Button
                                size="sm"
                                disabled={isFuture || isSaving}
                                onClick={() =>
                                  handleStart(
                                    session.task_type,
                                    session.suggest_content?.contentId,
                                    dayPlan.day_number
                                  )
                                }
                                className={`cursor-pointer min-w-[80px] font-medium shadow-none transition-colors ${
                                  session.isCompleted
                                    ? "bg-green-600 text-white hover:bg-green-700 border border-green-200"
                                    : isFuture
                                    ? "bg-white text-gray-400 border border-gray-200 cursor-not-allowed"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                }`}
                              >
                                {session.isCompleted ? "✓ Done" : isFuture ? "Locked" : "Start"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No tasks for this day</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

      {showChat && hasPlanChat && studyPlan.thread_id && (
        <StudyPlanChatPanel
          threadId={studyPlan.thread_id}
          onClose={() => {
            const next = new URLSearchParams(searchParams);
            next.delete("chat");
            setSearchParams(next, { replace: true });
          }}
        />
      )}
      </div>
    </div>
  );
}