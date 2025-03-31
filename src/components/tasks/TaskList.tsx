import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Task } from "@/types/task";
import { useAlertStore } from "@/stores/useAlertStore";
import { globalAlertHandler } from "@/utils/globalAlertHandler";
import { useTaskStore } from "@/stores/useTaskStore";

export const TaskList = ({ onEdit }: { onEdit: (task: Task) => void }) => {
  const { tasks, fetchTasks, deleteTask, isLoading } = useTaskStore();
  const { showAlert } = useAlertStore();
  const [filter, setFilter] = useState<string>("all");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const filtered =
      filter === "all" ? tasks : tasks.filter((task) => task.status === filter);
    setFilteredTasks(filtered);
  }, [tasks, filter]);

  const handleDelete = async (id: string | undefined) => {
    try {
      if (!id) {
        showAlert("ID da tarefa inválido", "warning");
        return;
      }

      await deleteTask(id);
      showAlert("Tarefa excluída com sucesso.", "info");
    } catch (error) {
      globalAlertHandler(error);
    }
  };

  const renderFilterButton = (filterValue: string, label: string) => (
    <Button
      variant={filter === filterValue ? "default" : "outline"}
      onClick={() => setFilter(filterValue)}
      className="mr-2"
    >
      {label}
    </Button>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {isLoading && (
          <span className="text-sm text-gray-500">Carregando...</span>
        )}
      </div>

      <div className="mb-4">
        {renderFilterButton("all", "Todas")}
        {renderFilterButton("PENDING", "Pendentes")}
        {renderFilterButton("COMPLETED", "Concluídas")}
      </div>

      <Table className="min-w-full leading-normal">
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                Nenhuma tarefa encontrada
              </TableCell>
            </TableRow>
          ) : (
            filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <span
                    className={`
                      px-2 py-1 rounded text-xs 
                      ${
                        task.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    `}
                  >
                    {task.status === "PENDING" ? "Pendente" : "Concluída"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(task)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
