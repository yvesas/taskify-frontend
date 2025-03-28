import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../stores/authStore";
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
import { useTasks } from "@/hooks/useTasks";
import { useErrorStore } from "@/stores/errorStore";
import { globalErrorHandler } from "@/utils/globalErrorHandler";

interface TaskFormProps {
  task?: TaskData;
  onClose: () => void;
  onTaskUpdated?: () => void;
}

export const TaskForm = ({ task, onClose, onTaskUpdated }: TaskFormProps) => {
  const { token } = useAuthStore();
  const { addTask, updateTask } = useTasks();
  const { setError } = useErrorStore();

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
        setError({
          message: "Usuário não autenticado.",
          type: "error",
        });
        return;
      }

      const taskData = { ...data, id: task?.id };
      const response = task?.id
        ? await updateTask(taskData)
        : await addTask(taskData);

      if (response) {
        setError({
          message: `Tarefa ${task ? "atualizada" : "criada"} com sucesso!`,
          type: "info",
        });
        onClose();
        onTaskUpdated?.();
      }
    } catch (error) {
      globalErrorHandler(error);
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
