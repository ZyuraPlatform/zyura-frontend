
import { useParams, useLocation } from "react-router-dom";
import {
  useGetStudyPlanQuery,
} from "@/store/features/studyPlan/studyPlan.api";
import StudyPlanView, { StudyPlanData } from "./StudyPlanView";

export default function WeeklyPlan() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const planFromState = location.state?.plan as StudyPlanData | undefined;
  const { data, isLoading } = useGetStudyPlanQuery({});
  const studyPlan: StudyPlanData | undefined =
    data?.data?.find((p: StudyPlanData) => p._id === id) || planFromState;
  return (
    <StudyPlanView
      studyPlan={studyPlan}
      isLoading={Boolean(isLoading && !planFromState)}
      backTo="/dashboard/smart-study"
    />
  );
}
