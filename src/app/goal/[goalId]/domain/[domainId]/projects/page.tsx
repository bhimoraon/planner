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
import { ArrowLeft, Plus, FolderOpen, Calendar, TrendingUp, Layers, Loader2 } from "lucide-react"
import { createProject, getDomains, getProjects } from "@/lib/action"

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

export default function ProjectsPage() {
  const params = useParams()
  const router = useRouter()
  const goalId = params.goalId as string
  const domainId = params.domainId as string

  const [currentDomain, setCurrentDomain] = useState<Domain | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    deadline: "",
  })

  useEffect(() => {
    fetchDomainAndProjects()
  }, [domainId])

  const fetchDomainAndProjects = async () => {
    try {
      setLoading(true)

      const domainResult = await getDomains(goalId)

      if (domainResult.success && domainResult.data) {
        const domain = domainResult.data.find((g: Domain) => g.id === domainId)
        // console.log("Current domain:", domain)
        setCurrentDomain(domain || null)
      }


      // Fetch projects for this domain using Server Action
      const projectsResult = await getProjects(domainId)

      if (projectsResult.success && projectsResult.data) {
        setProjects(projectsResult.data)
      }

    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProject.title) return

    try {
      setCreating(true)
      const formData = new FormData()
      formData.append("title", newProject.title)
      formData.append("description", newProject.description || "")
      formData.append("deadline", newProject.deadline || "")
      formData.append("goalId", goalId)
      formData.append("domainId", domainId)

      const result = await createProject(formData)

      if (result.success && result.data) {
        setProjects([result.data, ...projects])
        setNewProject({
          title: "",
          description: "",
          deadline: "",
        })
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setCreating(false)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/goal/${goalId}/domain/${domainId}/project/${projectId}/tasks`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading projects...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!currentDomain) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Domain Not Found</h1>
          <Button onClick={() => router.push(`/goal/${goalId}/domains`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Domains
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
              onClick={() => router.push(`/goal/${goalId}/domains`)}
              className="mb-4 p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Domains
            </Button>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <FolderOpen className="h-8 w-8 text-primary" />
              Projects for {currentDomain?.title}
            </h1>
            <p className="text-muted-foreground mt-2">Organize your domain into specific projects</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Domain Overview Card */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Domain Overview
            </CardTitle>
            <CardDescription>{currentDomain?.description}</CardDescription>
          </CardHeader>
        </Card>

        {/* Create Project Form */}
        {showCreateForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Add a specific project within this domain</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Classic Literature"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this project and its objectives"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={creating}>
                    {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Project
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const progressColor = getProgressColor(project.progress)

            return (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {project.progress.toFixed(0)}%
                    </div>
                  </div>
                  {project.description && <CardDescription className="text-sm">{project.description}</CardDescription>}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{project.progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {project.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="text-xs">Created: {new Date(project.createdAt).toLocaleDateString()}</div>
                    {project.completedAt && (
                      <div className="text-xs">Completed: {new Date(project.completedAt).toLocaleDateString()}</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-4">Create projects to organize your domain work</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
