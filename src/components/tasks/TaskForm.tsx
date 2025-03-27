import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "sonner";

interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
}

const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  status: z.enum(["PENDING", "COMPLETED"]),
});

export const TaskForm = ({
  task,
  onClose,
}: {
  task?: Task;
  onClose: () => void;
}) => {
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || "PENDING",
    },
  });

  const onSubmit = async (data: Task) => {
    console.log("onSubmit called ->", data);
    setIsLoading(true);
    try {
      if (!token) {
        toast.error("Usuário não autenticado.");
        return;
      }
      if (!data.title || !data.description) {
        toast.error("Tarefa não informada.");
        return;
      }

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
        toast.success(`Tarefa ${task ? "atualizada" : "criada"} com sucesso!`);
        onClose();
      } else {
        toast.error("Erro ao salvar tarefa. Tente novamente.");
      }
    } catch (error) {
      toast.error("Erro ao salvar tarefa. Tente novamente.");
      console.error("Erro ao salvar tarefa:", error);
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Título" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Descrição" />
              </FormControl>
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
