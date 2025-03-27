import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../ui/button";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export const TaskList = () => {
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
      <h2 className="text-2xl font-semibold mb-4">Lista de Tarefas</h2>
      <div>
        <Button onClick={() => setFilter("all")}>Todas</Button>
        <Button onClick={() => setFilter("PENDING")}>Pendentes</Button>
        <Button onClick={() => setFilter("COMPLETED")}>Concluídas</Button>
      </div>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Título
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {task.title}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {task.description}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {task.status}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <Button>Editar</Button>
                <Button
                  onClick={() => {
                    handleDelete(task.id);
                  }}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
