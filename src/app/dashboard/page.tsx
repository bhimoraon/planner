import {
  Plus,
  Calendar,
  Users,
  Target,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getDashboardStats, getTodaysTasks, getRecentProjects, getUpcomingTasks } from "@/lib/actions"

export default async function HomePage() {
  const [statsResult, todaysTasksResult, recentProjectsResult, upcomingTasksResult] = await Promise.all([
    getDashboardStats(),
    getTodaysTasks(),
    getRecentProjects(),
    getUpcomingTasks(),
  ])

  const stats = statsResult.success ? statsResult.data : null
  const todaysTasks = todaysTasksResult.success ? todaysTasksResult.data : []
  const recentProjects = recentProjectsResult.success ? recentProjectsResult.data : []
  const upcomingTasks = upcomingTasksResult.success ? upcomingTasksResult.data : []

  const totalItems = (stats?.goals.total || 0) + (stats?.projects.total || 0) + (stats?.tasks.total || 0)
  const completedItems =
    (stats?.goals.completed || 0) + (stats?.projects.completed || 0) + (stats?.tasks.completed || 0)
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <BarChart3 className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Project Dashboard
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your goals, domains, projects, and tasks in one place.
              </p>
            </div>
          </div>
        </div>
        <Button className="gap-2 h-11 px-6 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90">
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-enhanced hover:scale-[1.02] transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Active Goals</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
              <Target className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.goals.active || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {stats?.goals.completed || 0} completed of {stats?.goals.total || 0} total
            </p>
            <div className="mt-3">
              <Progress
                value={stats?.goals.total ? (stats.goals.completed / stats.goals.total) * 100 : 0}
                className="h-1.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover:scale-[1.02] transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Projects</CardTitle>
            <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <Users className="size-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.projects.total || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">{stats?.projects.completed || 0} completed</p>
            <div className="mt-3">
              <Progress
                value={stats?.projects.total ? (stats.projects.completed / stats.projects.total) * 100 : 0}
                className="h-1.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover:scale-[1.02] transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Completed Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
              <CheckCircle2 className="size-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.tasks.completed || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">of {stats?.tasks.total || 0} total tasks</p>
            <div className="mt-3">
              <Progress
                value={stats?.tasks.total ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}
                className="h-1.5"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover:scale-[1.02] transition-all duration-200 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Overdue Tasks</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
              <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats?.tasks.overdue || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">Need immediate attention</p>
            {(stats?.tasks.overdue || 0) > 0 && (
              <div className="mt-3 px-2 py-1 bg-red-500/10 rounded-md">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">Action required</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="card-enhanced">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="size-5 text-accent" />
              </div>
              Overall Progress
            </CardTitle>
            <CardDescription className="text-base">
              Your completion progress across all goals, projects, and tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">Goals</span>
                </div>
                <span className="text-sm font-semibold">
                  {stats?.goals.completed || 0}/{stats?.goals.total || 0}
                </span>
              </div>
              <Progress
                value={stats?.goals.total ? (stats.goals.completed / stats.goals.total) * 100 : 0}
                className="h-3 bg-muted/50"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">Projects</span>
                </div>
                <span className="text-sm font-semibold">
                  {stats?.projects.completed || 0}/{stats?.projects.total || 0}
                </span>
              </div>
              <Progress
                value={stats?.projects.total ? (stats.projects.completed / stats.projects.total) * 100 : 0}
                className="h-3 bg-muted/50"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="font-medium">Tasks</span>
                </div>
                <span className="text-sm font-semibold">
                  {stats?.tasks.completed || 0}/{stats?.tasks.total || 0}
                </span>
              </div>
              <Progress
                value={stats?.tasks.total ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}
                className="h-3 bg-muted/50"
              />
            </div>

            <div className="pt-6 border-t border-border/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold">Overall Progress</span>
                <span className="text-2xl font-bold text-accent">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-4 bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Calendar className="size-5 text-orange-600 dark:text-orange-400" />
              </div>
              Today&apos;s Tasks
            </CardTitle>
            <CardDescription className="text-base">Tasks due today that need your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {todaysTasks?.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-3 rounded-full bg-green-500/10 w-fit mx-auto mb-3">
                  <CheckCircle2 className="size-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-muted-foreground">No tasks due today. Great job staying on top of things!</p>
              </div>
            ) : (
              todaysTasks?.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <p className="font-medium leading-tight">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.project?.title}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        task.priority === "HIGH" ? "destructive" : task.priority === "MEDIUM" ? "default" : "secondary"
                      }
                      className="text-xs font-medium"
                    >
                      {task.priority}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      Today
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="card-enhanced md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Activity className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              Recent Projects
            </CardTitle>
            <CardDescription className="text-base">
              Your most recently updated projects and their progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects?.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-3">
                  <Users className="size-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No projects found. Create your first project to get started!</p>
              </div>
            ) : (
              recentProjects?.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between space-x-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium leading-tight">{project.title}</p>
                      <Badge
                        variant={
                          project.status === "COMPLETED"
                            ? "default"
                            : project.status === "ON_HOLD"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs font-medium"
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.domain?.title}</p>
                    <div className="flex items-center gap-3">
                      <Progress value={project.progressData?.progress || 0} className="flex-1 h-2" />
                      <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                        {project.progressData?.progress || 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span className="min-w-[5rem]">
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : "No deadline"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="card-enhanced">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Clock className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              Upcoming Tasks
            </CardTitle>
            <CardDescription className="text-base">Tasks due in the next 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks?.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-3">
                  <Clock className="size-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-center">No upcoming tasks in the next 7 days.</p>
              </div>
            ) : (
              upcomingTasks?.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start space-x-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <p className="font-medium leading-tight">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.project?.title}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        task.priority === "HIGH" ? "destructive" : task.priority === "MEDIUM" ? "default" : "secondary"
                      }
                      className="text-xs font-medium"
                    >
                      {task.priority}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span className="min-w-[4rem]">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
