import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "PENDING");
  const { token } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/tasks${task ? `/${task.id}` : ""}`,
        {
          method: task ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, status }),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
      />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="PENDING">Pendente</option>
        <option value="COMPLETED">Concluída</option>
      </select>
      <Button type="submit">Salvar</Button>
    </form>
  );
};
