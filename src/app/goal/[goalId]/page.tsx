"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
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
  ArrowLeft,
  Plus,
  Target,
  Calendar,
  TrendingUp,
  Layers,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
  FolderOpen,
  Briefcase,
  CheckSquare,
} from "lucide-react"
import { getDomains, createDomain, getOneGoal, updateDomain, deleteDomain } from "@/lib/actions"

interface Domain {
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
}

interface Goal {
  id: string
  title: string
  description?: string | null
  status: "ON_HOLD" | "IN_PROGRESS" | "COMPLETED"
  progress: number
  deadline?: Date | null
  createdAt: Date
  completedAt: Date | null
  userId?: string
}

export default function DomainsPage() {
  const params = useParams()
  const router = useRouter()
  const goalId = params.goalId as string

  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newDomain, setNewDomain] = useState({
    title: "",
    description: "",
    deadline: "",
  })

  const [editDomain, setEditDomain] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "IN_PROGRESS" as "ON_HOLD" | "IN_PROGRESS" | "COMPLETED",
  })

  useEffect(() => {
    fetchGoalAndDomains()
  }, [goalId])

  const fetchGoalAndDomains = async () => {
    try {
      setLoading(true)

      // Fetch goal details using Server Action
      const goalResult = await getOneGoal(goalId)

      setCurrentGoal(goalResult.data || null)

      // Fetch domains for this goal using Server Action
      const domainsResult = await getDomains(goalId)
      if (domainsResult.success && domainsResult.data) {
        setDomains(domainsResult.data)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDomain.title) return

    try {
      setCreating(true)
      const formData = new FormData()
      formData.append("title", newDomain.title)
      formData.append("description", newDomain.description || "")
      formData.append("deadline", newDomain.deadline || "")
      formData.append("goalId", goalId)

      const result = await createDomain(formData)

      if (result.success && result.data) {
        setDomains([result.data, ...domains])
        setNewDomain({
          title: "",
          description: "",
          deadline: "",
        })
        setShowCreateForm(false)
      } else {
        console.error("Error creating domain:", result.error)
      }
    } catch (error) {
      console.error("Error creating domain:", error)
    } finally {
      setCreating(false)
    }
  }

  const handleEditDomain = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDomain || !editDomain.title) return

    try {
      setUpdating(true)
      const formData = new FormData()
      formData.append("title", editDomain.title)
      formData.append("description", editDomain.description)
      formData.append("deadline", editDomain.deadline)
      formData.append("status", editDomain.status)

      const result = await updateDomain(editingDomain.id, formData)

      if (result.success && result.data) {
        setDomains(domains.map((domain) => (domain.id === editingDomain.id ? result.data : domain)))
        setEditingDomain(null)
      } else {
        console.error("[v0] Error updating domain:", result.error)
        alert("Failed to update domain. Please try again.")
      }
    } catch (error) {
      console.error("Error updating domain:", error)
      alert("Failed to update domain. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteDomain = async (domainId: string) => {
    try {
      setDeleting(domainId)
      const result = await deleteDomain(domainId)

      if (result.success) {
        setDomains(domains.filter((domain) => domain.id !== domainId))
      } else {
        console.error("[v0] Error deleting domain:", result.error)
        alert("Failed to delete domain. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting domain:", error)
      alert("Failed to delete domain. Please try again.")
    } finally {
      setDeleting(null)
    }
  }

  const openEditSheet = (domain: Domain) => {
    setEditingDomain(domain)
    setEditDomain({
      title: domain.title,
      description: domain.description || "",
      deadline: domain.deadline ? new Date(domain.deadline).toISOString().split("T")[0] : "",
      status: domain.status,
    })
  }

  const getProgressColor = (progress: number, status: string) => {
    if (status === "COMPLETED") return "bg-green-500"
    if (progress >= 75) return "bg-blue-500"
    if (progress >= 50) return "bg-yellow-500"
    if (progress >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      ON_HOLD: "bg-gray-100 text-gray-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
    }
    return statusColors[status as keyof typeof statusColors] || statusColors.ON_HOLD
  }

  const handleDomainClick = (domainId: string) => {
    router.push(`/domain/${domainId}`)
  }

  const handleCardClick = (e: React.MouseEvent, domainId: string) => {
    // Don't navigate if clicking on dropdown or its children
    if ((e.target as HTMLElement).closest("[data-dropdown-trigger]")) {
      return
    }
    handleDomainClick(domainId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading domains...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!currentGoal) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Goal Not Found</h1>
          <Button onClick={() => router.push("/goals")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Goals
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
              onClick={() => router.push("/goals")}
              className="mb-4 p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Goals
            </Button>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Layers className="h-8 w-8 text-primary" />
              Domains for {currentGoal?.title}
            </h1>
            <p className="text-muted-foreground mt-2">Break down your goal into manageable domains</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Domain
          </Button>
        </div>

        {/* Goal Overview Card */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Goal Overview
            </CardTitle>
            <CardDescription>{currentGoal?.description}</CardDescription>
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Domains</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {domains.filter((d) => d.status === "COMPLETED").length}/{domains.length}
                    </div>
                    <div className="text-xs text-muted-foreground">completed</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Projects</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {domains.reduce((acc, domain) => acc + Math.round((domain.progress / 100) * 5), 0)}/
                      {domains.length * 5}
                    </div>
                    <div className="text-xs text-muted-foreground">estimated</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Tasks</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {domains.reduce((acc, domain) => acc + Math.round((domain.progress / 100) * 25), 0)}/
                      {domains.length * 25}
                    </div>
                    <div className="text-xs text-muted-foreground">estimated</div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Goal Progress</span>
                  <span className="font-medium">{currentGoal?.progress.toFixed(0)}%</span>
                </div>
                <Progress value={currentGoal?.progress || 0} className="h-2" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Create Domain Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Domain</CardTitle>
              <CardDescription>Add a specific domain to track within this goal</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDomain} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Domain Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Fiction Books"
                    value={newDomain.title}
                    onChange={(e) => setNewDomain({ ...newDomain, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this domain and its focus area"
                    value={newDomain.description}
                    onChange={(e) => setNewDomain({ ...newDomain, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newDomain.deadline}
                    onChange={(e) => setNewDomain({ ...newDomain, deadline: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Domain
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => {
            const progressColor = getProgressColor(domain.progress, domain.status)

            return (
              <Card
                key={domain.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={(e) => handleCardClick(e, domain.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">{domain.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {domain.progress.toFixed(0)}%
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
                              openEditSheet(domain)
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
                                <AlertDialogTitle>Delete Domain</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {domain.title}? This action cannot be undone and
                                  will also delete all associated projects and tasks.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDomain(domain.id)}
                                  disabled={deleting === domain.id}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {deleting === domain.id && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {domain.description && <CardDescription className="text-sm">{domain.description}</CardDescription>}
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(domain.status)}`}>
                      {domain.status.replace("_", " ")}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{domain.progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={domain.progress} className="h-2" />
                  </div>

                  {/* Domain Details */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {domain.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {new Date(domain.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="text-xs">Created: {new Date(domain.createdAt).toLocaleDateString()}</div>
                    {domain.completedAt && (
                      <div className="text-xs">Completed: {new Date(domain.completedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {domains.length === 0 && !loading && (
          <div className="text-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No domains yet</h3>
            <p className="text-muted-foreground mb-4">Create domains to break down your goal into manageable parts</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Domain
            </Button>
          </div>
        )}

        <Sheet open={!!editingDomain} onOpenChange={(open) => !open && setEditingDomain(null)}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit Domain</SheetTitle>
              <SheetDescription>Update your domain details and track your progress</SheetDescription>
            </SheetHeader>
            <form onSubmit={handleEditDomain} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Domain Title</Label>
                <Input
                  id="edit-title"
                  placeholder="e.g., Fiction Books"
                  value={editDomain.title}
                  onChange={(e) => setEditDomain({ ...editDomain, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Describe this domain and its focus area"
                  value={editDomain.description}
                  onChange={(e) => setEditDomain({ ...editDomain, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editDomain.status}
                  onValueChange={(value: "ON_HOLD" | "IN_PROGRESS" | "COMPLETED") =>
                    setEditDomain({ ...editDomain, status: value })
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
                  value={editDomain.deadline}
                  onChange={(e) => setEditDomain({ ...editDomain, deadline: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updating}>
                  {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Update Domain
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingDomain(null)}>
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
