"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Target, Calendar, TrendingUp, Loader2 } from "lucide-react"
import { createGoal } from "@/lib/action"

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
}

export function GoalsClient({ initialGoals }: { initialGoals: Goal[] }) {
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [creating, setCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    deadline: "",
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

  const getStatusBadge = (status: string) => {
    const statusColors = {
      ON_HOLD: "bg-gray-100 text-gray-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
    }
    return statusColors[status as keyof typeof statusColors] || statusColors.ON_HOLD
  }

  const handleGoalClick = (goalId: string) => {
    router.push(`/goal/${goalId}/domains`)
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
              onClick={() => handleGoalClick(goal.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">{goal.title}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {goal.progress.toFixed(0)}%
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
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{goal.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {/* Goal Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  {goal.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="text-xs">Created: {new Date(goal.createdAt).toLocaleDateString()}</div>
                  {goal.completedAt && (
                    <div className="text-xs">Completed: {new Date(goal.completedAt).toLocaleDateString()}</div>
                  )}
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
      </div>
    </div>
  )
}
