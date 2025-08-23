import { Plus, Calendar, Users, Target, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function HomePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Project Dashboard</h1>
          <p className="text-muted-foreground">Manage your goals, domains, projects, and tasks in one place.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">-2 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Projects */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your most recently updated projects and their progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Website Redesign", domain: "Marketing", progress: 75, status: "In Progress", dueDate: "Dec 15" },
              {
                name: "Mobile App Development",
                domain: "Engineering",
                progress: 45,
                status: "In Progress",
                dueDate: "Jan 30",
              },
              { name: "Customer Analytics", domain: "Sales", progress: 90, status: "Review", dueDate: "Dec 10" },
              { name: "Brand Guidelines", domain: "Marketing", progress: 100, status: "Completed", dueDate: "Nov 28" },
            ].map((project, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">{project.name}</p>
                    <Badge
                      variant={
                        project.status === "Completed"
                          ? "default"
                          : project.status === "Review"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{project.domain}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={project.progress} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  {project.dueDate}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks due in the next 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { task: "Review design mockups", project: "Website Redesign", priority: "High", dueDate: "Today" },
              { task: "Update API documentation", project: "Mobile App", priority: "Medium", dueDate: "Tomorrow" },
              { task: "Client presentation prep", project: "Customer Analytics", priority: "High", dueDate: "Dec 12" },
              { task: "Test user authentication", project: "Mobile App", priority: "Low", dueDate: "Dec 13" },
              { task: "Finalize color palette", project: "Brand Guidelines", priority: "Medium", dueDate: "Dec 14" },
            ].map((task, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{task.task}</p>
                  <p className="text-xs text-muted-foreground">{task.project}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {task.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
