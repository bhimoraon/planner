"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
  FolderOpen,
  Briefcase,
  CheckSquare,
} from "lucide-react"
import { createGoal, updateGoal, deleteGoal } from "@/lib/actions"
import { formatDate } from "@/lib/utils"

interface ProgressData {
  domains: { total: number; completed: number }
  projects: { total: number; completed: number }
  tasks: { total: number; completed: number }
  overall: { total: number; completed: number }
  progress: number
}

interface Goal {
  id: string
  title: string
  description?: string | null
  status: "ON_HOLD" | "IN_PROGRESS" | "COMPLETED"
  progress: number
  deadline?: Date | null
  createdAt: Date
  completedAt?: Date | null
  userId?: string
  progressData?: ProgressData | null
}

export function GoalsClient({ initialGoals }: { initialGoals: Goal[] }) {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    deadline: "",
  })

  const [editGoal, setEditGoal] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "IN_PROGRESS" as "ON_HOLD" | "IN_PROGRESS" | "COMPLETED",
  })

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoal.title) return

    try {
      setCreating(true)
      const formData = new FormData()
      formData.append("title", newGoal.title)
      formData.append("description", newGoal.description)
      formData.append("deadline", newGoal.deadline)

      const result = await createGoal(formData)

      if (result.success && result.data) {
        setGoals([result.data, ...goals])
        setNewGoal({ title: "", description: "", deadline: "" })
        setShowCreateForm(false)
      } else {
        console.error("[v0] Error creating goal:", result.error)
        alert("Failed to create goal. Please try again.")
      }
    } catch (error) {
      console.error("Error creating goal:", error)
      alert("Failed to create goal. Please try again.")
    } finally {
      setCreating(false)
    }
  }

  const handleEditGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGoal || !editGoal.title) return

    try {
      setUpdating(true)
      const formData = new FormData()
      formData.append("title", editGoal.title)
      formData.append("description", editGoal.description)
      formData.append("deadline", editGoal.deadline)
      formData.append("status", editGoal.status)

      const result = await updateGoal(editingGoal.id, formData)

      if (result.success && result.data) {
        setGoals(goals.map((goal) => (goal.id === editingGoal.id ? result.data : goal)))
        setEditingGoal(null)
      } else {
        console.error("[v0] Error updating goal:", result.error)
        alert("Failed to update goal. Please try again.")
      }
    } catch (error) {
      console.error("Error updating goal:", error)
      alert("Failed to update goal. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    try {
      setDeleting(goalId)
      const result = await deleteGoal(goalId)

      if (result.success) {
        setGoals(goals.filter((goal) => goal.id !== goalId))
      } else {
        console.error("[v0] Error deleting goal:", result.error)
        alert("Failed to delete goal. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting goal:", error)
      alert("Failed to delete goal. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const openEditSheet = (goal: Goal) => {
    setEditingGoal(goal)
    setEditGoal({
      title: goal.title,
      description: goal.description || "",
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split("T")[0] : "",
      status: goal.status,
    })
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      ON_HOLD: "bg-gray-100 text-gray-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
    }
    return statusColors[status as keyof typeof statusColors] || statusColors.ON_HOLD
  }

  const handleGoalClick = (goalId: string) => {
    router.push(`/goal/${goalId}`)
  }

  const handleCardClick = (e: React.MouseEvent, goalId: string) => {
    // Don't navigate if clicking on dropdown or its children
    if (
      (e.target as HTMLElement).closest("[data-dropdown-trigger]") ||
      (e.target as HTMLElement).closest("[data-dropdown-content]")
    ) {
      return
    }
    handleGoalClick(goalId)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              My Goals
            </h1>
            <p className="text-muted-foreground mt-2">Track your progress and achieve your dreams</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>

        {/* Create Goal Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Goal</CardTitle>
              <CardDescription>Set a new goal and start tracking your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Learn React Development"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your goal and why it matters to you"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Goal
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card
              key={goal.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={(e) => handleCardClick(e, goal.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {goal.progressData?.progress ?? goal.progress.toFixed(0)}%
                    </div>
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
                            openEditSheet(goal)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {goal.title}? This action cannot be undone and will
                                also delete all associated domains, projects, and tasks.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteGoal(goal.id)}
                                disabled={deleting === goal.id}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleting === goal.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {goal.description && <CardDescription className="text-sm">{goal.description}</CardDescription>}
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(goal.status)}`}>
                    {goal.status.replace("_", " ")}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Overview Section */}
                {goal.progressData && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-muted-foreground">Overview</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">Domains:</span>
                        <span className="font-medium">
                          {goal.progressData.domains.completed}/{goal.progressData.domains.total}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3 w-3 text-green-500" />
                        <span className="text-muted-foreground">Projects:</span>
                        <span className="font-medium">
                          {goal.progressData.projects.completed}/{goal.progressData.projects.total}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckSquare className="h-3 w-3 text-purple-500" />
                        <span className="text-muted-foreground">Tasks:</span>
                        <span className="font-medium">
                          {goal.progressData.tasks.completed}/{goal.progressData.tasks.total}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progressData?.progress ?? goal.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={goal.progressData?.progress ?? goal.progress} className="h-2" />
                </div>

                {/* Goal Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {goal.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="text-xs">Created: {formatDate(goal.createdAt)}</div>
                  {goal.completedAt && <div className="text-xs">Completed: {formatDate(goal.completedAt)}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">Create your first goal to start tracking your progress</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </div>
        )}

        <Sheet open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Edit Goal</SheetTitle>
              <SheetDescription>Update your goal details and track your progress</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleEditGoal} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Goal Title</Label>
                <Input
                  id="edit-title"
                  placeholder="e.g., Learn React Development"
                  value={editGoal.title}
                  onChange={(e) => setEditGoal({ ...editGoal, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe your goal and why it matters to you"
                  value={editGoal.description}
                  onChange={(e) => setEditGoal({ ...editGoal, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editGoal.status}
                  onValueChange={(value: "ON_HOLD" | "IN_PROGRESS" | "COMPLETED") =>
                    setEditGoal({ ...editGoal, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editGoal.deadline}
                  onChange={(e) => setEditGoal({ ...editGoal, deadline: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Goal
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingGoal(null)}>
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
