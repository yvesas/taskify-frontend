import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export const TaskList = ({ onEdit }: { onEdit: (task: Task) => void }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { token } = useAuthStore();
  const [filter, setFilter] = useState<string>("all");
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Erro ao buscar tarefas:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTasks();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Erro ao excluir tarefa:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4">Tarefas</h3>
      <div>
        <Button onClick={() => setFilter("all")}>Todas</Button>
        <Button onClick={() => setFilter("PENDING")}>Pendentes</Button>
        <Button onClick={() => setFilter("COMPLETED")}>Concluídas</Button>
      </div>
      <Table className="min-w-full leading-normal">
        <TableHeader>
          <TableRow>
            <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Título
            </TableHead>
            <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Descrição
            </TableHead>
            <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {task.title}
              </TableCell>
              <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {task.description}
              </TableCell>
              <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {task.status}
              </TableCell>
              <TableCell className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <Button onClick={() => onEdit(task)}>Editar</Button>
                <Button
                  onClick={() => {
                    handleDelete(task.id);
                  }}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
