import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../stores/useAuthStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../ui/form";
import { useState } from "react";
import { TaskData, TaskSchema } from "@/schemas/validations";
import { useAlertStore } from "@/stores/useAlertStore";
import { globalAlertHandler } from "@/utils/globalAlertHandler";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/useTaskStore";

interface TaskFormProps {
  task?: TaskData;
  onClose: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const { token } = useAuthStore();
  const { addTask, updateTask } = useTaskStore();
  const { showAlert } = useAlertStore();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TaskData>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "PENDING",
    },
  });

  const onSubmit = async (data: TaskData) => {
    setIsLoading(true);
    try {
      if (!token) {
        showAlert("Usuário não autenticado.", "error");
        return;
      }

      const taskData = { ...data, id: task?.id } as Task;
      const response = task?.id
        ? await updateTask(taskData)
        : await addTask(taskData);

      if (response) {
        showAlert(
          `Tarefa ${task ? "atualizada" : "criada"} com sucesso!`,
          "success"
        );
        onClose();
      }
    } catch (error) {
      globalAlertHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Título"
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Descrição"
                  aria-invalid={fieldState.error ? "true" : "false"}
                />
              </FormControl>
              {fieldState.error && (
                <p className="text-red-500 text-sm">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="COMPLETED">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
};
