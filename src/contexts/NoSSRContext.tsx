import React, { createContext, useContext, useRef } from "react";
import { sleep } from "../helpers/utils";
import { TaskType } from "../helpers/types";

interface INoSSRProviderValue {
  addTask: (props: TaskType) => void;
}

const NoSSRContext = createContext<INoSSRProviderValue>({ addTask: () => {} });

export const useNoSSRContext = () => {
  return useContext(NoSSRContext);
};

interface INoSSRProvider {
  children: React.JSX.Element;
  priorityLevels: number;
  maxWeight: number | null;
  defaultWeight?: number;
}

export const NoSSRProvider: React.FC<INoSSRProvider> = ({
  children,
  priorityLevels = 1,
  maxWeight = null,
  defaultWeight = 1,
}) => {
  if (priorityLevels < 1) {
    throw new Error("priorityLevels should be more then 0");
  }

  const queue = useRef<TaskType[][]>(
    Array.from({ length: priorityLevels }, () => []),
  );
  const processing = useRef(false);
  const count = useRef(0);
  const currentWeightSum = useRef(0);

  const pushTask = ({ task }: { task?: TaskType }) => {
    if (!task) {
      return;
    }
    const priority = task?.priority || 0;
    const priorityIndex = priorityLevels - priority - 1;
    queue.current?.[priorityIndex]?.push(task);
  };

  const popTask = () => {
    queue.current.forEach((subQueue) => {
      if (subQueue?.length) {
        return subQueue?.shift();
      }
    });
    return null;
  };

  const checkReleaseMainThread = ({ task }: { task?: TaskType }) => {
    if (!maxWeight) {
      return true;
    }

    currentWeightSum.current += task?.weight || defaultWeight;
    if (currentWeightSum.current >= maxWeight) {
      currentWeightSum.current = 0;
      return true;
    }
    return false;
  };

  const doTask = ({ task }: { task?: TaskType }) => {
    count.current += 1;

    task?.action?.();
  };

  const start = async () => {
    processing.current = true;
    while (processing.current) {
      const task = popTask();
      if (task) {
        doTask({ task });
        const shouldReleaseMainThread = checkReleaseMainThread({ task });

        if (shouldReleaseMainThread) {
          await sleep(0);
        }
      } else {
        processing.current = false;
      }
    }
  };

  const addTask = (task: TaskType) => {
    const priority = task.priority || 0;
    if (priority > priorityLevels - 1) {
      throw new Error(`maximum priority level is ${task.priority}`);
    }
    pushTask({ task });

    if (!processing.current) {
      start();
    }
  };

  return (
    <NoSSRContext.Provider
      value={{
        addTask,
      }}
    >
      {children}
    </NoSSRContext.Provider>
  );
};
