// type.ts — full replacement

export interface SubTopic {
  name: string;
}

export interface Topic {
  topicName: string;
  subTopics: string[];
}

export interface System {
  name: string;
  topics: Topic[];
}

export interface Subject {
  name: string;
  systems: System[]; // ← now full System objects, not just string[]
}

export interface SelectedSubTopic {
  name: string;
}

export interface SelectedTopic {
  topicName: string;
  subTopicNames: string[]; // selected subtopics
  fullTopic: boolean;
}

export interface SelectedSystem {
  systemName: string;
  topics: SelectedTopic[];
  fullSystem: boolean;
}

export interface SelectedSubject {
  subjectName: string;
  systems: SelectedSystem[]; // ← was systemNames: string[]
  fullSubject: boolean;
}

export interface FormData {
  goalName: string;
  studyHoursPerDay: number;
  startDate: string;
  endDate: string;
}

export interface ModalProps {
  showModal: boolean;
  currentStep: number;
  onClose: () => void;
  children?: React.ReactNode;
  isEditMode?: boolean;
}

export interface Step1Props {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onNext: () => void;
  onCancel: () => void;
}

export interface Step2Props {
  availableSubjects: Subject[];
  selectedSubjects: SelectedSubject[];
  onSubjectToggle: (subjectName: string) => void;
  onFullSubjectToggle: (subjectName: string) => void;
  onSystemToggle: (subjectName: string, systemName: string) => void;
  onFullSystemToggle: (subjectName: string, systemName: string) => void;
  onTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onFullTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onSubTopicToggle: (subjectName: string, systemName: string, topicName: string, subTopicName: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export interface Step3Props {
  formData: FormData;
  selectedSubjects: SelectedSubject[];
  availableSubjects: Subject[];
  calculateDuration: () => number;
  calculateTotalStudyHours: () => number;
  calculateHoursPerSystem: () => string;
  onPrevious: () => void;
  onCreate: () => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}