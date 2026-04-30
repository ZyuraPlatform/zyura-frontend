import { useCallback, useState } from "react";
import type { SelectedSubject, Subject } from "./type";

/**
 * Shared state + handlers for SubjectTreeSelector / Goal Step 2.
 */
export function useSubjectTreeSelection(availableSubjects: Subject[]) {
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>(
    [],
  );

  const handleSubjectToggle = useCallback((subjectName: string): void => {
    setSelectedSubjects((prev) => {
      const existingIndex = prev.findIndex((s) => s.subjectName === subjectName);
      if (existingIndex >= 0) {
        return prev.filter((s) => s.subjectName !== subjectName);
      }
      return [
        ...prev,
        { subjectName, systemNames: [], fullSubject: false },
      ];
    });
  }, []);

  const handleFullSubjectToggle = useCallback(
    (subjectName: string): void => {
      const subject = availableSubjects.find((s) => s.name === subjectName);
      if (!subject) return;

      const fullSystems = subject.systems.map((sys) => ({
        systemName: sys.name,
        fullSystem: true,
        topics: sys.topics.map((t) => ({
          topicName: t.topicName,
          fullTopic: true,
          subTopicNames: [...t.subTopics],
        })),
      }));

      const systemNames = subject.systems.map((s) => s.name);

      setSelectedSubjects((prev) => {
        const existingIndex = prev.findIndex(
          (s) => s.subjectName === subjectName,
        );

        if (existingIndex === -1) {
          return [
            ...prev,
            {
              subjectName,
              systemNames,
              systems: fullSystems,
              fullSubject: true,
            },
          ];
        }

        const updated = [...prev];
        const currentFullSubject = updated[existingIndex].fullSubject;

        if (currentFullSubject) {
          updated[existingIndex] = {
            subjectName,
            systemNames: [],
            systems: [],
            fullSubject: false,
          };
        } else {
          updated[existingIndex] = {
            subjectName,
            systemNames,
            systems: fullSystems,
            fullSubject: true,
          };
        }
        return updated;
      });
    },
    [availableSubjects],
  );

  const handleSystemToggle = useCallback(
    (subjectName: string, systemName: string): void => {
      const subject = availableSubjects.find((s) => s.name === subjectName);
      if (!subject) return;

      setSelectedSubjects((prev) => {
        const existingIndex = prev.findIndex(
          (s) => s.subjectName === subjectName,
        );
        if (existingIndex === -1) return prev;

        const updated = [...prev];
        const systemIndex = (updated[existingIndex].systems ?? []).findIndex(
          (s) => s.systemName === systemName,
        );

        if (systemIndex >= 0) {
          updated[existingIndex].systemNames = (
            updated[existingIndex].systemNames ?? []
          ).filter((s) => s !== systemName);

          updated[existingIndex].systems = (
            updated[existingIndex].systems ?? []
          ).filter((s) => s.systemName !== systemName);
        } else {
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

        return updated;
      });
    },
    [availableSubjects],
  );

  const handleFullSystemToggle = useCallback(
    (subjectName: string, systemName: string): void => {
      const subject = availableSubjects.find((s) => s.name === subjectName);
      const system = subject?.systems.find((s) => s.name === systemName);
      if (!system) return;

      setSelectedSubjects((prev) =>
        prev.map((s) => {
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
    },
    [availableSubjects],
  );

  const handleTopicToggle = useCallback(
    (subjectName: string, systemName: string, topicName: string): void => {
      setSelectedSubjects((prev) =>
        prev.map((s) => {
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
    },
    [],
  );

  const handleFullTopicToggle = useCallback(
    (subjectName: string, systemName: string, topicName: string): void => {
      const subject = availableSubjects.find((s) => s.name === subjectName);
      const system = subject?.systems.find((s) => s.name === systemName);
      const topic = system?.topics.find((t) => t.topicName === topicName);
      if (!topic) return;

      setSelectedSubjects((prev) =>
        prev.map((s) => {
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
    },
    [availableSubjects],
  );

  const handleSubTopicToggle = useCallback(
    (
      subjectName: string,
      systemName: string,
      topicName: string,
      subTopicName: string,
    ): void => {
      setSelectedSubjects((prev) =>
        prev.map((s) => {
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
    },
    [],
  );

  return {
    selectedSubjects,
    setSelectedSubjects,
    handleSubjectToggle,
    handleFullSubjectToggle,
    handleSystemToggle,
    handleFullSystemToggle,
    handleTopicToggle,
    handleFullTopicToggle,
    handleSubTopicToggle,
  };
}
