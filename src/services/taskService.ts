import ApiClient from "@/utils/apiClient";
import { Task } from "@/types/task";

export class TaskService {
  private static ENDPOINT = "/tasks";

  static async getTasks(): Promise<Task[]> {
    return ApiClient.get<Task[]>(this.ENDPOINT);
  }

  static async createTask(task: Omit<Task, "id">): Promise<Task> {
    return ApiClient.post<Task>(this.ENDPOINT, task);
  }

  static async updateTask(task: Task): Promise<Task> {
    return ApiClient.patch<Task>(`${this.ENDPOINT}/${task.id}`, task);
  }

  static async deleteTask(id: string): Promise<void> {
    return ApiClient.delete(`${this.ENDPOINT}/${id}`);
  }
}
// Usage example
// const taskService = new TaskService();
// taskService.getTasks().then(tasks => console.log(tasks));
// taskService.createTask({ title: "New Task", description: "Task description" }).then(task => console.log(task));
// taskService.updateTask({ id: "1", title: "Updated Task", description: "Updated description" }).then(task => console.log(task));
// taskService.deleteTask("1").then(() => console.log("Task deleted"));
