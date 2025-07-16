export type TaskType = {
  action: () => void;
  id?: number | string;
  weight?: number | null;
  priority?: number;
};
