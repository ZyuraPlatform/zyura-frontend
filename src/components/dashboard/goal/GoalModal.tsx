
import { GoalStepIndicator } from "./GoalStepIndicator";
import {
  ModalProps,
  SelectedSubject,
  SelectedSystem,
  SelectedTopic,
  Step1Props,
  Step2Props,
  Step3Props,
  Subject,
  System,
  Topic,
} from "./type";

// ─── Reusable Toggle ───────────────────────────────────────────────────────
const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${
      checked ? "bg-blue-500" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
        checked ? "translate-x-4" : "translate-x-0"
      }`}
    />
  </button>
);

// ─── GoalModal ─────────────────────────────────────────────────────────────
export const GoalModal: React.FC<ModalProps> = ({
  showModal, currentStep, onClose, children, isEditMode = false,
}) => {
  if (!showModal) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Update Your Smart Study Planner" : "Create Your Smart Study Planner"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
        </div>
        <div className="px-6 py-4">
          <GoalStepIndicator currentStep={currentStep} />
        </div>
        {children}
      </div>
    </div>
  );
};

// ─── Step 1 ────────────────────────────────────────────────────────────────
export const Step1: React.FC<Step1Props> = ({ formData, onFormDataChange, onNext, onCancel }) => {
  const isValid = formData.goalName && formData.studyHoursPerDay > 0 && formData.startDate && formData.endDate;
  return (
    <div className="p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Plan Name</label>
        <input type="text" placeholder="e.g., Final Year MBBS Preparation" value={formData.goalName}
          onChange={(e) => onFormDataChange({ ...formData, goalName: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Study hours per day</label>
        <input type="number" min="0" value={formData.studyHoursPerDay}
          onChange={(e) => onFormDataChange({ ...formData, studyHoursPerDay: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input type="date" value={formData.startDate}
            onChange={(e) => onFormDataChange({ ...formData, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input type="date" value={formData.endDate} min={formData.startDate}
            onChange={(e) => onFormDataChange({ ...formData, endDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer">Cancel</button>
        <button onClick={onNext} disabled={!isValid}
          className={`px-6 py-2 rounded-lg cursor-pointer ${isValid ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
          Next →
        </button>
      </div>
    </div>
  );
};

// ─── SubTopic Row ──────────────────────────────────────────────────────────
const SubTopicRow: React.FC<{
  subTopicName: string;
  isChecked: boolean;
  onToggle: () => void;
}> = ({ subTopicName, isChecked, onToggle }) => (
  <label className="flex items-center gap-2 text-xs text-gray-600 py-1.5 px-2 hover:bg-gray-50 rounded cursor-pointer">
    <input
      type="checkbox"
      checked={isChecked}
      onChange={onToggle}
      className="w-3 h-3 accent-blue-500"
    />
    {subTopicName}
  </label>
);

// ─── Topic Row (FIXED: always show all sub-topics from full list) ─────────
// Checking a topic reveals its subtopics immediately.
const TopicRow: React.FC<{
  topic: Topic;
  selectedTopic: SelectedTopic | undefined;
  onTopicToggle: () => void;
  onFullTopicToggle: () => void;
  onSubTopicToggle: (subTopicName: string) => void;
}> = ({ topic, selectedTopic, onTopicToggle, onFullTopicToggle, onSubTopicToggle }) => {
  const isSelected = !!selectedTopic;
  const hasSubTopics = topic.subTopics.length > 0;

  return (
    <div className="pl-2 border-l-2 border-gray-100 ml-1 mb-1">
      {/* Topic checkbox row */}
      <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onTopicToggle}
          className="w-3.5 h-3.5 accent-blue-500 shrink-0"
        />
        <span className={`text-sm ${isSelected ? "text-gray-800 font-medium" : "text-gray-600"}`}>
          {topic.topicName}
        </span>
        {isSelected && hasSubTopics && (
          <span className="ml-auto text-xs text-gray-400">
            {selectedTopic?.subTopicNames.length ?? 0}/{topic.subTopics.length} sub-topics
          </span>
        )}
      </div>

      {/* Sub-topics revealed when topic is selected */}
      {isSelected && hasSubTopics && (
        <div className="ml-4 mt-1 mb-2">
          {/* Full topic toggle */}
          <div className="flex items-center justify-between bg-blue-50 px-2 py-1.5 rounded mb-1.5">
            <span className="text-xs text-gray-600">Cover all sub-topics</span>
            <Toggle checked={selectedTopic?.fullTopic ?? false} onChange={onFullTopicToggle} />
          </div>

          {/* Sub-topic checkboxes (hidden when fullTopic is on) */}
          {!selectedTopic?.fullTopic && (
            <div className="space-y-0.5 pl-1 border-l border-gray-100">
              {topic.subTopics.map((st) => (
                <SubTopicRow
                  key={st}
                  subTopicName={st}
                  isChecked={selectedTopic?.subTopicNames.includes(st) ?? false}
                  onToggle={() => onSubTopicToggle(st)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── System Row (FIXED: always show all topics from full list) ────────────
// Checking a system reveals its topics immediately.
const SystemRow: React.FC<{
  system: System;
  selectedSystem: SelectedSystem | undefined;
  onSystemToggle: () => void;
  onFullSystemToggle: () => void;
  onTopicToggle: (topicName: string) => void;
  onFullTopicToggle: (topicName: string) => void;
  onSubTopicToggle: (topicName: string, subTopicName: string) => void;
}> = ({
  system,
  selectedSystem,
  onSystemToggle,
  onFullSystemToggle,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
}) => {
  const isSelected = !!selectedSystem;
  const hasTopics = system.topics.length > 0;
  // Number of selected topics (from selectedSystem)
  const selectedTopicCount = selectedSystem?.topics?.length ?? 0;

  return (
    <div className="pl-3 border-l-2 border-gray-200 ml-2 mb-2">
      {/* System checkbox row */}
      <div className="flex items-center gap-2 py-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSystemToggle}
          className="w-3.5 h-3.5 accent-blue-500 shrink-0"
        />
        <span className={`text-sm ${isSelected ? "text-gray-800 font-medium" : "text-gray-500"}`}>
          {system.name}
        </span>
        {isSelected && hasTopics && (
          <span className="ml-auto text-xs text-gray-400">
            {selectedTopicCount}/{system.topics.length} topics
          </span>
        )}
      </div>

      {/* Topics revealed when system is selected */}
      {isSelected && (
        <div className="ml-4 mt-1 mb-1">
          {/* Full system toggle */}
          <div className="flex items-center justify-between bg-blue-50 px-2 py-1.5 rounded mb-2">
            <span className="text-xs text-gray-600">Cover full system</span>
            <Toggle checked={selectedSystem?.fullSystem ?? false} onChange={onFullSystemToggle} />
          </div>

          {/* Topic list (hidden when fullSystem is on) */}
          {!selectedSystem?.fullSystem && hasTopics && (
            <div className="space-y-1">
              <p className="text-xs text-gray-400 mb-1 px-1">Select topics</p>
              {/* Map over the FULL list of topics from availableSubjects */}
              {system.topics.map((topic) => {
                const selTopic = selectedSystem?.topics.find(
                  (t) => t.topicName === topic.topicName
                );
                return (
                  <TopicRow
                    key={topic.topicName}
                    topic={topic}
                    selectedTopic={selTopic}
                    onTopicToggle={() => onTopicToggle(topic.topicName)}
                    onFullTopicToggle={() => onFullTopicToggle(topic.topicName)}
                    onSubTopicToggle={(st) => onSubTopicToggle(topic.topicName, st)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Subject Item ──────────────────────────────────────────────────────────
// Unchanged except for passing correct props.
export const SubjectItem: React.FC<{
  subject: Subject;
  selected: SelectedSubject | undefined;
  onSubjectToggle: (name: string) => void;
  onFullSubjectToggle: (name: string) => void;
  onSystemToggle: (subjectName: string, systemName: string) => void;
  onFullSystemToggle: (subjectName: string, systemName: string) => void;
  onTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onFullTopicToggle: (subjectName: string, systemName: string, topicName: string) => void;
  onSubTopicToggle: (
    subjectName: string,
    systemName: string,
    topicName: string,
    subTopicName: string,
  ) => void;
}> = ({
  subject,
  selected,
  onSubjectToggle,
  onFullSubjectToggle,
  onSystemToggle,
  onFullSystemToggle,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
}) => {
  const isSelected = !!selected;
  const selectedSystemCount = selected?.systems?.length ?? 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Subject row */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSubjectToggle(subject.name)}
          className="mt-1 w-4 h-4 accent-blue-500 shrink-0"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-900">{subject.name}</div>
            {isSelected && (
              <span className="text-xs text-gray-400">
                {selectedSystemCount}/{subject.systems.length} systems
              </span>
            )}
          </div>
          <div className="text-sm text-gray-400 mb-1">{subject.systems.length} systems</div>

          {/* Systems revealed when subject is selected */}
          {isSelected && selected && (
            <>
              {/* Full subject toggle */}
              <div className="mt-2 flex items-center justify-between bg-blue-50 p-2 rounded">
                <span className="text-sm text-gray-600">Cover Full Subject</span>
                <Toggle
                  checked={selected.fullSubject}
                  onChange={() => onFullSubjectToggle(subject.name)}
                />
              </div>

              {/* Systems list — shown when fullSubject is off */}
              {!selected.fullSubject && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-400 mb-1">Select Systems &amp; Topics</p>
                  {subject.systems.map((system) => {
                    const selSystem = (selected.systems ?? []).find(
                      (s) => s.systemName === system.name,
                    );
                    return (
                      <SystemRow
                        key={system.name}
                        system={system}
                        selectedSystem={selSystem}
                        onSystemToggle={() => onSystemToggle(subject.name, system.name)}
                        onFullSystemToggle={() => onFullSystemToggle(subject.name, system.name)}
                        onTopicToggle={(topicName) =>
                          onTopicToggle(subject.name, system.name, topicName)
                        }
                        onFullTopicToggle={(topicName) =>
                          onFullTopicToggle(subject.name, system.name, topicName)
                        }
                        onSubTopicToggle={(topicName, st) =>
                          onSubTopicToggle(subject.name, system.name, topicName, st)
                        }
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Step 2 (unchanged) ────────────────────────────────────────────────────
export const Step2: React.FC<Step2Props> = ({
  availableSubjects,
  selectedSubjects,
  onSubjectToggle,
  onFullSubjectToggle,
  onSystemToggle,
  onFullSystemToggle,
  onTopicToggle,
  onFullTopicToggle,
  onSubTopicToggle,
  onPrevious,
  onNext,
}) => {
  const totalSystems = selectedSubjects.reduce(
    (t, s) => t + (s.systems?.length ?? 0),
    0,
  );
  const totalTopics = selectedSubjects.reduce(
    (t, s) =>
      t +
      (s.systems ?? []).reduce(
        (tt, sys) => tt + (sys.topics?.length ?? 0),
        0,
      ),
    0,
  );
  const isValid = selectedSubjects.length > 0 && totalSystems > 0;

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-2">Select Subjects</h3>
      <p className="text-sm text-gray-600 mb-4">
        Choose subjects, systems, topics, and sub-topics to cover
      </p>

      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm flex gap-4">
        <span className="font-medium">{selectedSubjects.length} subjects</span>
        <span>·</span>
        <span className="font-medium">{totalSystems} systems</span>
        <span>·</span>
        <span className="font-medium">{totalTopics} topics</span>
      </div>

      <div className="max-h-96 overflow-y-auto mb-4 space-y-3 pr-1">
        {availableSubjects.map((subject) => {
          const selected = selectedSubjects.find(
            (s) => s.subjectName === subject.name,
          );
          return (
            <SubjectItem
              key={subject.name}
              subject={subject}
              selected={selected}
              onSubjectToggle={onSubjectToggle}
              onFullSubjectToggle={onFullSubjectToggle}
              onSystemToggle={onSystemToggle}
              onFullSystemToggle={onFullSystemToggle}
              onTopicToggle={onTopicToggle}
              onFullTopicToggle={onFullTopicToggle}
              onSubTopicToggle={onSubTopicToggle}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onPrevious}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg cursor-pointer ${
            isValid
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ─── Step 3 (unchanged) ────────────────────────────────────────────────────
export const Step3: React.FC<Step3Props> = ({
  formData,
  selectedSubjects,
  calculateDuration,
  calculateTotalStudyHours,
  calculateHoursPerSystem,
  onPrevious,
  isEditMode = false,
  onCreate,
  isLoading = false,
}) => (
  <div className="p-6">
    <h3 className="text-lg font-semibold mb-4">Goal Overview</h3>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">Goal Name</div>
        <div className="font-medium">{formData.goalName}</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">Study Hours/Day</div>
        <div className="font-medium">{formData.studyHoursPerDay} hours</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">Total Duration</div>
        <div className="font-medium">{calculateDuration()} days</div>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="text-sm text-gray-600">Total Study Hours</div>
        <div className="font-medium">{calculateTotalStudyHours()} hours</div>
      </div>
    </div>

    <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
      Each system will receive approximately{" "}
      <span className="font-semibold">{calculateHoursPerSystem()} hours</span>
    </div>

    <div className="max-h-60 overflow-y-auto space-y-4 mb-6">
      {selectedSubjects.map((subject) => (
        <div key={subject.subjectName} className="border-l-4 border-blue-500 pl-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-lg">{subject.subjectName}</div>
            <div className="text-sm text-gray-600">
              {subject.fullSubject ? "Full Subject" : `${subject.systems.length} systems`}
            </div>
          </div>

          {!subject.fullSubject &&
            (subject.systems ?? []).map((sys) => (
              <div key={sys.systemName} className="mb-2 pl-2 border-l border-gray-200">
                <div className="text-sm font-medium text-gray-700 flex justify-between">
                  <span>{sys.systemName}</span>
                  <span className="text-gray-400 text-xs">
                    {sys.fullSystem ? "Full System" : `${sys.topics.length} topics`}
                  </span>
                </div>

                {!sys.fullSystem && sys.topics.length > 0 && (
                  <div className="pl-3 mt-1 flex flex-wrap gap-1">
                    {sys.topics.map((topic) => (
                      <span
                        key={topic.topicName}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded"
                      >
                        {topic.topicName}
                        {topic.subTopicNames.length > 0 &&
                          ` (${topic.subTopicNames.length} sub-topics)`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>

    <div className="flex justify-between mt-6">
      <button
        onClick={onPrevious}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        ← Previous
      </button>
      <button
        onClick={onCreate}
        disabled={isLoading}
        className={`px-6 py-2 rounded-lg cursor-pointer ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isLoading ? "Saving..." : isEditMode ? "Update Preference" : "Create Preference"}
      </button>
    </div>
  </div>
);