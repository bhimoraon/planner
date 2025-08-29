import type React from "react"
import { Clock, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTodaysTasks, getTomorrowsTasks, getYesterdaysTasks, getOverdueTasks } from "@/lib/actions"

type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  priority: "LOW" | "MEDIUM" | "HIGH"
  deadline: string | Date | null
  project?: { title?: string | null } | null
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const variant = priority === "HIGH" ? "destructive" : priority === "MEDIUM" ? "default" : "secondary"
  return (
    <Badge variant={variant/* as any */} className="text-xs font-medium">
      {priority}
    </Badge>
  )
}

function TaskRow({ task, rightLabel }: { task: Task; rightLabel: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-tight">{task.title}</p>
        {task.project?.title && <p className="text-sm text-muted-foreground">{task.project.title}</p>}
      </div>
      <div className="flex flex-col items-end gap-2">
        <PriorityBadge priority={task.priority} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          <span>{rightLabel}</span>
        </div>
      </div>
    </div>
  )
}

async function getData() {
  const [todayRes, tomorrowRes, yesterdayRes, overdueRes] = await Promise.all([
    getTodaysTasks(),
    getTomorrowsTasks(),
    getYesterdaysTasks(),
    getOverdueTasks(),
  ])

  const todays = (todayRes.success ? todayRes.data : []) as Task[]
  const tomorrows = (tomorrowRes.success ? tomorrowRes.data : []) as Task[]
  const yesterdays = (yesterdayRes.success ? yesterdayRes.data : []) as Task[]
  const overdues = (overdueRes.success ? overdueRes.data : []) as Task[]

  // Show only actionable (incomplete) tasks in UI
  const filterPending = (ts: Task[]) => ts.filter((t) => !t.completed)

  return {
    today: filterPending(todays),
    tomorrow: filterPending(tomorrows),
    yesterday: filterPending(yesterdays),
    overdue: filterPending(overdues),
  }
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { today, tomorrow, yesterday, overdue } = await getData()

  const params = await searchParams
  const filtered = (params?.filter || "").toLowerCase()

  const showOnlyOverdue = filtered === "overdue"

  const Section = ({
    title,
    description,
    items,
    rightLabel,
    icon,
    accentClass,
    emptyText,
    id,
  }: {
    title: string
    description: string
    items: Task[]
    rightLabel: string
    icon: React.ReactNode
    accentClass: string
    emptyText: string
    id: string
  }) => (
    <Card id={id} className="card-enhanced">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className={`p-2 rounded-lg ${accentClass}`}>{icon}</div>
          {title}
        </CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-3 rounded-full bg-muted/50 w-fit mx-auto mb-3">
              <AlertCircle className="size-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{emptyText}</p>
          </div>
        ) : (
          items.map((t) => <TaskRow key={t.id} task={t} rightLabel={rightLabel} />)
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Calendar className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">Tasks</h1>
              <p className="text-muted-foreground">View overdue items and tasks for yesterday, today, and tomorrow.</p>
            </div>
          </div>
        </div>
      </div>

      {showOnlyOverdue ? (
        <div className="grid gap-8">
          <Section
            id="overdue"
            title="Overdue"
            description="Tasks past their due date. Tackle these first."
            items={overdue}
            rightLabel="Overdue"
            icon={<AlertCircle className="size-5 text-red-600 dark:text-red-400" />}
            accentClass="bg-red-500/10"
            emptyText="No overdue tasks. You're up to date!"
          />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <Section
            id="overdue"
            title="Overdue"
            description="Tasks past their due date. Tackle these first."
            items={overdue}
            rightLabel="Overdue"
            icon={<AlertCircle className="size-5 text-red-600 dark:text-red-400" />}
            accentClass="bg-red-500/10"
            emptyText="No overdue tasks. You're up to date!"
          />
          <Section
            id="yesterday"
            title="Yesterday"
            description="Unfinished tasks due yesterday."
            items={yesterday}
            rightLabel="Yesterday"
            icon={<Clock className="size-5 text-foreground" />}
            accentClass="bg-muted/50"
            emptyText="No tasks from yesterday."
          />
          <Section
            id="today"
            title="Today"
            description="Tasks scheduled for today."
            items={today}
            rightLabel="Today"
            icon={<Calendar className="size-5 text-orange-600 dark:text-orange-400" />}
            accentClass="bg-orange-500/10"
            emptyText="No tasks due today."
          />
          <Section
            id="tomorrow"
            title="Tomorrow"
            description="Prepare for what's next."
            items={tomorrow}
            rightLabel="Tomorrow"
            icon={<Calendar className="size-5 text-blue-600 dark:text-blue-400" />}
            accentClass="bg-blue-500/10"
            emptyText="No tasks due tomorrow."
          />
        </div>
      )}
    </div>
  )
}
