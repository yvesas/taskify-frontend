import { useState } from "react";
import { TaskList } from "../../components/tasks/TaskList";
import { TaskForm } from "../../components/tasks/TaskForm";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Task } from "@/types/task";

const TasksPage = () => {
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

  const handleClose = async () => {
    setOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Taskify</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate}>Criar Tarefa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para criar ou editar uma tarefa.
            </DialogDescription>
            <TaskForm task={selectedTask} onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <TaskList onEdit={handleOpenEdit} />
    </div>
  );
};

export default TasksPage;
