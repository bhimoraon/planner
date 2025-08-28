"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Plus,
  CheckSquare,
  Calendar,
  Clock,
  AlertCircle,
  FolderOpen,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react"
import { createTask, getOneProject, getTasks, toggleTask, updateTask, deleteTask } from "@/lib/actions"

interface Task {
  id: string
  projectId: string | null
  domainId: string | null
  goalId: string | null
  title: string
  description: string | null
  notes: string | null
  deadline: Date | null
  priority: "LOW" | "MEDIUM" | "HIGH"
  completed: boolean
  createdAt: Date
  completedAt: Date | null
  userId: string
}

interface Project {
  id: string
  title: string
  description?: string | null
  deadline?: Date | null
  status: "ON_HOLD" | "IN_PROGRESS" | "COMPLETED"
  progress: number
  createdAt: Date
  completedAt?: Date | null
  userId: string
  goalId?: string | null
  domainId?: string | null
}

export default function TasksPage() {
  const params = useParams()
  const router = useRouter()
  const [goalId, setGoalId] = useState<string | null | undefined>(null)
  const [domainId, setDomainId] = useState<string | null | undefined>(null)
  const projectId = params.projectId as string

  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    notes: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    deadline: "",
  })

  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
    notes: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    deadline: "",
  })

  useEffect(() => {
    fetchProjectAndTasks()
  }, [projectId])

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true)

      const projectsResult = await getOneProject(projectId)

      setCurrentProject(projectsResult.data || null)

      setGoalId(projectsResult.data?.goalId)
      setDomainId(projectsResult.data?.domainId)
      // Fetch tasks for this project using Server Action
      const tasksResult = await getTasks(projectId)
      if (tasksResult.success && tasksResult.data) {
        setTasks(tasksResult.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTask.title) return

    try {
      setCreating(true)
      const formData = new FormData()
      formData.append("title", newTask.title)
      formData.append("description", newTask.description || "")
      formData.append("notes", newTask.notes || "")
      formData.append("priority", newTask.priority)
      formData.append("deadline", newTask.deadline || "")
      formData.append("projectId", projectId)
      if (domainId) formData.append("domainId", domainId)
      if (goalId) formData.append("goalId", goalId)

      const result = await createTask(formData)

      if (result.success && result.data) {
        setTasks([result.data, ...tasks])
        setNewTask({
          title: "",
          description: "",
          notes: "",
          priority: "MEDIUM",
          deadline: "",
        })
      }

      setShowCreateForm(false)
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTask || !editTask.title) return

    try {
      setUpdating(true)
      const formData = new FormData()
      formData.append("title", editTask.title)
      formData.append("description", editTask.description)
      formData.append("notes", editTask.notes)
      formData.append("priority", editTask.priority)
      formData.append("deadline", editTask.deadline)

      const result = await updateTask(editingTask.id, formData)

      if (result.success && result.data) {
        setTasks(tasks.map((task) => (task.id === editingTask.id ? result.data : task)))
        setEditingTask(null)
      } else {
        console.error("[v0] Error updating task:", result.error)
        alert("Failed to update task. Please try again.")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      alert("Failed to update task. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeleting(taskId)
      const result = await deleteTask(taskId)

      if (result.success) {
        setTasks(tasks.filter((task) => task.id !== taskId))
      } else {
        console.error("[v0] Error deleting task:", result.error)
        alert("Failed to delete task. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting task:", error)
      alert("Failed to delete task. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const openEditSheet = (task: Task) => {
    setEditingTask(task)
    setEditTask({
      title: task.title,
      description: task.description || "",
      notes: task.notes || "",
      priority: task.priority,
      deadline: task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "",
    })
  }

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const result = await toggleTask(taskId, !task.completed, projectId)

      if (result.success && result.data) {
        setTasks(tasks.map((t) => (t.id === taskId ? result.data : t)))
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200"
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const isOverdue = (deadline?: string | Date | null) => {
    if (!deadline) return false
    const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline
    if (!deadlineDate) return false
    return deadlineDate < new Date()
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading tasks...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <Button onClick={() => router.push(`/domain/${domainId}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push(`/domain/${domainId}`)}
              className="mb-4 p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <CheckSquare className="h-8 w-8 text-primary" />
              Tasks for {currentProject?.title}
            </h1>
            <p className="text-muted-foreground mt-2">Manage individual tasks within this project</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Project Overview Card */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Project Overview
            </CardTitle>
            <CardDescription>{currentProject?.description}</CardDescription>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                  <div className="text-sm font-semibold">{completedTasks.length}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                  <div className="text-sm font-semibold">{pendingTasks.length}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Total</span>
                  </div>
                  <div className="text-sm font-semibold">{tasks.length}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Project Progress</span>
                  <span className="font-medium">{currentProject?.progress.toFixed(0)}%</span>
                </div>
                <Progress value={currentProject?.progress || 0} className="h-2" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Create Task Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>Add a specific task to this project</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Read Pride and Prejudice"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what needs to be done"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or reminders"
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value: unknown) =>
                        setNewTask({ ...newTask, priority: value as "LOW" | "MEDIUM" | "HIGH" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Task
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card key={task.id} className={`transition-all ${task.completed ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <h3
                          className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority.toLowerCase()}
                          </Badge>
                          {task.deadline && isOverdue(task.deadline) && !task.completed && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Overdue
                            </Badge>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild data-dropdown-trigger>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" data-dropdown-content>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openEditSheet(task)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {task.title}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteTask(task.id)}
                                      disabled={deleting === task.id}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      {deleting === task.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {task.description && (
                        <p className={`text-sm ${task.completed ? "text-muted-foreground" : "text-muted-foreground"}`}>
                          {task.description}
                        </p>
                      )}

                      {task.notes && (
                        <p
                          className={`text-sm italic ${task.completed ? "text-muted-foreground" : "text-muted-foreground"}`}
                        >
                          Note: {task.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {task.deadline && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                        {task.completedAt && (
                          <div className="flex items-center gap-1">
                            <CheckSquare className="h-3 w-3" />
                            <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : !loading ? (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">Create tasks to track specific work items</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Task
              </Button>
            </div>
          ) : null}
        </div>

        <Sheet open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Task</SheetTitle>
              <SheetDescription>Update your task details and settings</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleEditTask} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input
                  id="edit-title"
                  placeholder="e.g., Read Pride and Prejudice"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe what needs to be done"
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Additional notes or reminders"
                  value={editTask.notes}
                  onChange={(e) => setEditTask({ ...editTask, notes: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={editTask.priority}
                  onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => setEditTask({ ...editTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editTask.deadline}
                  onChange={(e) => setEditTask({ ...editTask, deadline: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Task
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
