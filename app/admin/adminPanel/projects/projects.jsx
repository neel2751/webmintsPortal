"use client";
import { useState } from "react";
import { format } from "date-fns";
import { FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetchQuery } from "@/hooks/useFetch";
import { useSubmitMutation } from "@/hooks/useSubmit";
import {
  createMaintenanceTask,
  createProject,
  getClientUsers,
  getMyMaintenance,
  getMyProjects,
  updateMaintenanceStatus,
  updateProject,
} from "@/server/portalServer/portalServer";
import {
  MAINTENANCE_STATUSES,
  PROJECT_STATUSES,
  STATUS_BADGE,
} from "@/lib/portal-constants";

const EMPTY_PROJECT = {
  name: "",
  clientId: "",
  status: "Planning",
  progress: 0,
  startDate: "",
  endDate: "",
  maintenanceEndDate: "",
  description: "",
};

const EMPTY_TASK = { projectId: "", title: "", date: "", status: "Scheduled" };

export default function ProjectManagement() {
  const projectsKey = ["adminProjects"];
  const maintenanceKey = ["adminMaintenance"];

  const { data: projectsData } = useFetchQuery({
    queryKey: projectsKey,
    fetchFn: getMyProjects,
  });
  const { data: clientsData } = useFetchQuery({
    queryKey: ["adminClients"],
    fetchFn: getClientUsers,
  });
  const { data: maintenanceData } = useFetchQuery({
    queryKey: maintenanceKey,
    fetchFn: getMyMaintenance,
  });
  const projects = projectsData?.newData || [];
  const clients = clientsData?.newData || [];
  const tasks = maintenanceData?.newData || [];

  const [projectOpen, setProjectOpen] = useState(false);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [taskOpen, setTaskOpen] = useState(false);
  const [taskForm, setTaskForm] = useState(EMPTY_TASK);

  const { mutate: handleCreateProject, isPending: isCreatingProject } =
    useSubmitMutation({
      mutationFn: async (payload) => await createProject(payload),
      invalidateKey: projectsKey,
      onSuccessMessage: (message) => message || "Project created",
      onClose: () => {
        setProjectOpen(false);
        setProjectForm(EMPTY_PROJECT);
      },
    });

  const { mutate: handleUpdateProject } = useSubmitMutation({
    mutationFn: async (payload) => await updateProject(payload),
    invalidateKey: projectsKey,
    onSuccessMessage: (message) => message || "Project updated",
    onClose: () => {},
  });

  const { mutate: handleCreateTask, isPending: isCreatingTask } =
    useSubmitMutation({
      mutationFn: async (payload) => await createMaintenanceTask(payload),
      invalidateKey: maintenanceKey,
      onSuccessMessage: (message) => message || "Task created",
      onClose: () => {
        setTaskOpen(false);
        setTaskForm(EMPTY_TASK);
      },
    });

  const { mutate: handleTaskStatus } = useSubmitMutation({
    mutationFn: async (payload) => await updateMaintenanceStatus(payload),
    invalidateKey: maintenanceKey,
    onSuccessMessage: (message) => message || "Task updated",
    onClose: () => {},
  });

  return (
    <div className="mt-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Client Projects</CardTitle>
              <CardDescription>
                Create projects for clients and keep progress up to date — the
                client sees this on their dashboard.
              </CardDescription>
            </div>
            <Dialog open={projectOpen} onOpenChange={setProjectOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create a project</DialogTitle>
                  <DialogDescription>
                    The project appears on the selected client's dashboard.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project name</Label>
                    <Input
                      id="project-name"
                      placeholder="E-commerce Platform"
                      value={projectForm.name}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select
                      value={projectForm.clientId}
                      onValueChange={(clientId) =>
                        setProjectForm({ ...projectForm, clientId })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client._id} value={client._id}>
                            {client.name} ({client.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {clients.length === 0 && (
                      <p className="text-xs text-amber-600">
                        No client accounts yet — create one in the Users tab
                        first.
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={projectForm.status}
                        onValueChange={(status) =>
                          setProjectForm({ ...projectForm, status })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-progress">Progress (%)</Label>
                      <Input
                        id="project-progress"
                        type="number"
                        min={0}
                        max={100}
                        value={projectForm.progress}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            progress: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-start">Start date</Label>
                      <Input
                        id="project-start"
                        type="date"
                        value={projectForm.startDate}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-end">End date</Label>
                      <Input
                        id="project-end"
                        type="date"
                        value={projectForm.endDate}
                        onChange={(e) =>
                          setProjectForm({
                            ...projectForm,
                            endDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-maint">Maintenance end date</Label>
                    <Input
                      id="project-maint"
                      type="date"
                      value={projectForm.maintenanceEndDate}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          maintenanceEndDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-description">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="project-description"
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setProjectOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={
                      isCreatingProject ||
                      !projectForm.name ||
                      !projectForm.clientId
                    }
                    onClick={() => handleCreateProject(projectForm)}
                  >
                    {isCreatingProject ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No projects yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-neutral-500">Project</TableHead>
                  <TableHead className="text-neutral-500">Client</TableHead>
                  <TableHead className="text-neutral-500">Status</TableHead>
                  <TableHead className="text-neutral-500">Progress</TableHead>
                  <TableHead className="text-neutral-500">
                    Maintenance ends
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {project.client?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={project.status}
                        onValueChange={(status) =>
                          handleUpdateProject({ id: project._id, status })
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        className="w-20 h-8"
                        defaultValue={project.progress}
                        onBlur={(e) => {
                          const progress = Number(e.target.value);
                          if (progress !== project.progress) {
                            handleUpdateProject({ id: project._id, progress });
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {project.maintenanceEndDate
                        ? format(new Date(project.maintenanceEndDate), "PP")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>
                Schedule and track maintenance — clients see tasks for their
                own projects.
              </CardDescription>
            </div>
            <Dialog open={taskOpen} onOpenChange={setTaskOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>Create a maintenance task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <Select
                      value={taskForm.projectId}
                      onValueChange={(projectId) =>
                        setTaskForm({ ...taskForm, projectId })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-title">Title</Label>
                    <Input
                      id="task-title"
                      placeholder="Weekly database backup"
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-date">Date</Label>
                      <Input
                        id="task-date"
                        type="date"
                        value={taskForm.date}
                        onChange={(e) =>
                          setTaskForm({ ...taskForm, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select
                        value={taskForm.status}
                        onValueChange={(status) =>
                          setTaskForm({ ...taskForm, status })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MAINTENANCE_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={
                      isCreatingTask ||
                      !taskForm.projectId ||
                      !taskForm.title ||
                      !taskForm.date
                    }
                    onClick={() => handleCreateTask(taskForm)}
                  >
                    {isCreatingTask ? "Creating..." : "Create Task"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No maintenance tasks yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-neutral-500">Task</TableHead>
                  <TableHead className="text-neutral-500">Project</TableHead>
                  <TableHead className="text-neutral-500">Client</TableHead>
                  <TableHead className="text-neutral-500">Date</TableHead>
                  <TableHead className="text-neutral-500">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">{task.title}</TableCell>
                    <TableCell className="text-gray-500">
                      {task.project?.name}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {task.client?.name}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {format(new Date(task.date), "PP")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={task.status}
                        onValueChange={(status) =>
                          handleTaskStatus({ id: task._id, status })
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MAINTENANCE_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
