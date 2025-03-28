export type TaskStatus = "PENDING" | "COMPLETED";

export interface TaskBase {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface Task extends TaskBase {
  id?: string;
}
