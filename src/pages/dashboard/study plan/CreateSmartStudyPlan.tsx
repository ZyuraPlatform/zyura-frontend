/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import DashboardHeading from "@/components/reusable/DashboardHeading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Atom } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateStudyPlanMutation } from "@/store/features/studyPlan/studyPlan.api";
import { useGetMCQBankTreeQuery } from "@/store/features/MCQBank/MCQBank.api";
import { toast } from "sonner";
import type { Subject } from "@/components/dashboard/goal/type";
import { SubjectTreeSelector } from "@/components/dashboard/goal/SubjectTreeSelector";
import { useSubjectTreeSelection } from "@/components/dashboard/goal/useSubjectTreeSelection";
import { goalToStudyPlanTopics } from "@/utils/goalToStudyPlanTopics";

export default function CreateSmartStudyPlan() {
  const navigate = useNavigate();
  const [createStudyPlan, { isLoading }] = useCreateStudyPlanMutation();
  const { data: treeData, isLoading: isTreeLoading } = useGetMCQBankTreeQuery(
    {},
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

  const {
    selectedSubjects,
    handleSubjectToggle,
    handleFullSubjectToggle,
    handleSystemToggle,
    handleFullSystemToggle,
    handleTopicToggle,
    handleFullTopicToggle,
    handleSubTopicToggle,
  } = useSubjectTreeSelection(availableSubjects);

  const [title, setTitle] = useState("");
  const [dailyTime, setDailyTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [examDate, setExamDate] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const clearError = (field: string) => {
    setErrors((prev) => prev.filter((item) => item !== field));
  };

  const totalSystems = selectedSubjects.reduce(
    (t, s) => t + (s.systems?.length ?? 0),
    0,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    const parsedTime = Number(dailyTime);

    if (!title.trim()) newErrors.push("title");
    if (!parsedTime || parsedTime <= 0) newErrors.push("dailyTime");
    if (!startDate) newErrors.push("startDate");
    if (!examDate) newErrors.push("examDate");
    if (startDate && examDate && new Date(startDate) > new Date(examDate)) {
      newErrors.push("startDate");
      newErrors.push("examDate");
      toast.error("Start date must be before or equal to finish date");
    }
    const todayString = new Date().toISOString().split("T")[0];
    if (examDate && examDate < todayString) newErrors.push("examDate");
    if (selectedSubjects.length === 0 || totalSystems === 0) {
      newErrors.push("subjects");
      toast.error("Select at least one subject with systems or full coverage");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      if (!newErrors.includes("subjects")) {
        toast.error("Please fill in all required fields");
      }
      return;
    }

    const selectionSnapshot = selectedSubjects.map((s) => ({
      subjectName: s.subjectName,
      systemNames: s.systemNames,
      systems: s.systems ?? [],
      fullSubject: s.fullSubject ?? false,
    }));

    const topics = goalToStudyPlanTopics(
      selectionSnapshot as any,
      availableSubjects,
    );
    if (!topics.length) {
      toast.error("Could not build topics from your selection");
      return;
    }

    const examName = title.trim();

    try {
      const response: any = await createStudyPlan({
        title: examName,
        exam_name: examName,
        start_date: startDate,
        exam_date: examDate,
        daily_study_time: parsedTime,
        exam_type: "",
        topics,
        selection_snapshot: selectionSnapshot,
        created_from: "smart_study_planner",
      }).unwrap();

      const planId = response?.data?._id ?? response?._id;
      if (planId) {
        navigate(`/dashboard/weekly-plan/${planId}`);
      } else {
        toast.error("Failed to retrieve study plan ID");
      }
    } catch (error) {
      console.error("Create plan error:", error);
      toast.error("Failed to create study plan");
    }
  };

  if (isTreeLoading) {
    return (
      <div className="p-8 text-center text-slate-500">Loading subject tree…</div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <Link to="/dashboard/smart-study-plan" className="mb-7">
          <ArrowLeft />
        </Link>
        <DashboardHeading
          title="Create Smart Study Plan"
          titleSize="text-xl"
          description="Choose coverage and generate a dedicated plan with its own chat thread"
          className="mt-12 mb-12 space-y-1"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto p-1 md:p-6"
      >
        <div className="p-6 border rounded-xl border-black/10 bg-white h-fit">
          <h3 className="text-lg font-semibold mb-2">Plan details</h3>
          <p className="text-sm text-gray-500 mb-4">
            Name your plan and set your study window
          </p>

          <div className="grid grid-cols-1 gap-6 py-4">
            <div className="grid gap-2">
              <Label
                className={errors.includes("title") ? "text-red-500" : ""}
              >
                Plan title
              </Label>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearError("title");
                }}
                placeholder="e.g., Cardiology sprint"
                className={
                  errors.includes("title") ? "border-red-500 bg-red-50" : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label
                className={errors.includes("dailyTime") ? "text-red-500" : ""}
              >
                Daily study time (hours)
              </Label>
              <Input
                type="number"
                min={0}
                max={12}
                value={dailyTime}
                onChange={(e) => {
                  setDailyTime(e.target.value);
                  clearError("dailyTime");
                }}
                className={
                  errors.includes("dailyTime")
                    ? "border-red-500 bg-red-50"
                    : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label
                className={errors.includes("startDate") ? "text-red-500" : ""}
              >
                Start date
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  clearError("startDate");
                }}
                className={
                  errors.includes("startDate")
                    ? "border-red-500 bg-red-50"
                    : ""
                }
              />
            </div>

            <div className="grid gap-2">
              <Label
                className={errors.includes("examDate") ? "text-red-500" : ""}
              >
                Finish date
              </Label>
              <Input
                type="date"
                min={startDate || undefined}
                value={examDate}
                onChange={(e) => {
                  setExamDate(e.target.value);
                  clearError("examDate");
                }}
                className={
                  errors.includes("examDate")
                    ? "border-red-500 bg-red-50"
                    : ""
                }
              />
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-xl border-black/10 bg-white flex flex-col gap-4">
          <SubjectTreeSelector
            availableSubjects={availableSubjects}
            selectedSubjects={selectedSubjects}
            onSubjectToggle={handleSubjectToggle}
            onFullSubjectToggle={handleFullSubjectToggle}
            onSystemToggle={handleSystemToggle}
            onFullSystemToggle={handleFullSystemToggle}
            onTopicToggle={handleTopicToggle}
            onFullTopicToggle={handleFullTopicToggle}
            onSubTopicToggle={handleSubTopicToggle}
            heading="Coverage"
            description="Select subjects, systems, and topics — or use Cover Full Subject / system"
            scrollClassName="max-h-[min(420px,50vh)]"
          />

          {errors.includes("subjects") && (
            <p className="text-sm text-red-600">Select at least one system or full subject.</p>
          )}

          <button
            disabled={isLoading}
            type="submit"
            className="w-full flex justify-center gap-4 bg-blue-main text-white py-2 rounded-lg"
          >
            <Atom className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Generating…" : "Generate plan"}
          </button>
        </div>
      </form>
    </div>
  );
}
