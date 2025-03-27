import { useState } from "react";
import { TaskList } from "../../components/tasks/TaskList";
import { TaskForm } from "../../components/tasks/TaskForm";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

export const TasksPage = () => {
  const [open, setOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Criar Tarefa");
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  const handleOpenCreate = () => {
    setOpen(true);
    setSelectedTask(undefined);
    setDialogTitle("Criar Tarefa");
  };

  const handleOpenEdit = (task: Task) => {
    setOpen(true);
    setSelectedTask(task);
    setDialogTitle("Editar Tarefa");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Taskify</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>Criar Tarefa</Button>
          </DialogTrigger>
          <DialogContent>
            <h3 className="text-lg font-semibold mb-4">{dialogTitle}</h3>
            <TaskForm task={selectedTask} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <TaskList onEdit={handleOpenEdit} />
    </div>
  );
};
