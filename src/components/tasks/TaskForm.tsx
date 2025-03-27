import { useForm, Controller } from "react-hook-form";
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
import { Form } from "../ui/form";
import { useEffect } from "react";

interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
}

export const TaskForm = ({
  task,
  onClose,
}: {
  task?: Task;
  onClose: () => void;
}) => {
  const { handleSubmit, control, setValue } = useForm<Task>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "PENDING",
    },
  });
  const { token } = useAuthStore();

  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
      setValue("status", task.status);
    }
  }, [task, setValue]);

  const onSubmit = async (data: Task) => {
    try {
      const response = await fetch(
        `http://localhost:3000/tasks${task ? `/${task.id}` : ""}`,
        {
          method: task ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        onClose();
      } else {
        console.error("Erro ao salvar tarefa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
    }
  };

  return (
    <Form
      {...{ control, handleSubmit: handleSubmit(onSubmit) }}
      classNames={{ root: "space-y-4" }}
    >
      <Controller
        name="title"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Título" />}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => <Input {...field} placeholder="Descrição" />}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select defaultValue={status} {...field}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="COMPLETED">Concluída</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit">Salvar</Button>
    </Form>
  );
};
