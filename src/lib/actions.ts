"use server"

import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"

export async function getGoals() {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: "68a8c4c77a9438a9701ceffa" },
      orderBy: { createdAt: "desc" },
    })

    // Get progress data for each goal
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const progressResult = await getGoalProgress(goal.id)
        return {
          ...goal,
          progressData: progressResult.success ? progressResult.data : null,
        }
      }),
    )

    return { success: true, data: goalsWithProgress }
  } catch (error) {
    console.error("  Server Action: Error fetching goals:", error)
    return { success: false, error: "Failed to fetch goals" }
  }
}

export async function getOneGoal(goalId: string) {
  try {
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    })
    return { success: true, data: goal }
  } catch (error) {
    console.error("  Server Action: Error fetching goals:", error)
    return { success: false, error: "Failed to fetch goals" }
  }
}

export async function createGoal(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const deadline = formData.get("deadline") as string

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        userId: "68a8c4c77a9438a9701ceffa",
        status: "IN_PROGRESS",
        progress: 0,
      },
    })

    revalidatePath("/")
    return { success: true, data: goal }
  } catch (error) {
    console.error("  Server Action: Error creating goal:", error)
    return { success: false, error: "Failed to create goal" }
  }
}

export async function updateGoal(goalId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const deadline = formData.get("deadline") as string
    const status = formData.get("status") as "ON_HOLD" | "IN_PROGRESS" | "COMPLETED"

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        status,
      },
    })

    revalidatePath("/goals")
    return { success: true, data: goal }
  } catch (error) {
    console.error("Server Action: Error updating goal:", error)
    return { success: false, error: "Failed to update goal" }
  }
}

export async function deleteGoal(goalId: string) {
  try {
    await prisma.goal.delete({
      where: { id: goalId },
    })

    revalidatePath("/goals")
    return { success: true }
  } catch (error) {
    console.error("Server Action: Error deleting goal:", error)
    return { success: false, error: "Failed to delete goal" }
  }
}

export async function getDomains(goalId: string) {
  try {
    const domains = await prisma.domain.findMany({
      where: { goalId },
      orderBy: { createdAt: "desc" },
    })

    // Get progress data for each domain
    const domainsWithProgress = await Promise.all(
      domains.map(async (domain) => {
        const progressResult = await getDomainProgress(domain.id)
        return {
          ...domain,
          progressData: progressResult.success ? progressResult.data : null,
        }
      }),
    )

    return { success: true, data: domainsWithProgress }
  } catch (error) {
    console.error("  Server Action: Error fetching domains:", error)
    return { success: false, error: "Failed to fetch domains" }
  }
}

export async function getOneDomain(domainId: string) {
  try {
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
    })
    return { success: true, data: domain }
  } catch (error) {
    console.error("  Server Action: Error fetching domains:", error)
    return { success: false, error: "Failed to fetch domains" }
  }
}

export async function createDomain(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const goalId = formData.get("goalId") as string

    const domain = await prisma.domain.create({
      data: {
        title,
        description,
        goalId,
        userId: "68a8c4c77a9438a9701ceffa",
        status: "IN_PROGRESS",
        progress: 0,
      },
    })

    revalidatePath(`/goal/${goalId}`)
    return { success: true, data: domain }
  } catch (error) {
    console.error("  Server Action: Error creating domain:", error)
    return { success: false, error: "Failed to create domain" }
  }
}

export async function updateDomain(domainId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const deadline = formData.get("deadline") as string
    const status = formData.get("status") as "ON_HOLD" | "IN_PROGRESS" | "COMPLETED"

    const domain = await prisma.domain.update({
      where: { id: domainId },
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        status,
      },
    })

    const goalId = domain.goalId
    if (goalId) {
      revalidatePath(`/goal/${goalId}`)
    }
    return { success: true, data: domain }
  } catch (error) {
    console.error("Server Action: Error updating domain:", error)
    return { success: false, error: "Failed to update domain" }
  }
}

export async function deleteDomain(domainId: string) {
  try {
    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
      select: { goalId: true },
    })

    await prisma.domain.delete({
      where: { id: domainId },
    })

    if (domain?.goalId) {
      revalidatePath(`/goal/${domain.goalId}`)
    }
    return { success: true }
  } catch (error) {
    console.error("Server Action: Error deleting domain:", error)
    return { success: false, error: "Failed to delete domain" }
  }
}

export async function getProjects(domainId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { domainId },
      orderBy: { createdAt: "desc" },
    })

    // Get progress data for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const progressResult = await getProjectProgress(project.id)
        return {
          ...project,
          progressData: progressResult.success ? progressResult.data : null,
        }
      }),
    )

    return { success: true, data: projectsWithProgress }
  } catch (error) {
    console.error("  Server Action: Error fetching projects:", error)
    return { success: false, error: "Failed to fetch projects" }
  }
}

export async function getOneProject(projectId: string) {
  try {
    const projects = await prisma.project.findUnique({
      where: { id: projectId },
    })
    return { success: true, data: projects }
  } catch (error) {
    console.error("  Server Action: Error fetching projects:", error)
    return { success: false, error: "Failed to fetch projects" }
  }
}

export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const domainId = formData.get("domainId") as string
    const goalId = formData.get("goalId") as string

    const project = await prisma.project.create({
      data: {
        title,
        description,
        domainId,
        goalId,
        userId: "68a8c4c77a9438a9701ceffa",
        progress: 0,
      },
    })

    revalidatePath(`/domain/${domainId}`)
    return { success: true, data: project }
  } catch (error) {
    console.error("  Server Action: Error creating project:", error)
    return { success: false, error: "Failed to create project" }
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const deadline = formData.get("deadline") as string
    const status = formData.get("status") as "ON_HOLD" | "IN_PROGRESS" | "COMPLETED"

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        description,
        deadline: deadline ? new Date(deadline) : null,
        status,
      },
    })

    const domainId = project.domainId
    if (domainId) {
      revalidatePath(`/domain/${domainId}`)
    }
    return { success: true, data: project }
  } catch (error) {
    console.error("Server Action: Error updating project:", error)
    return { success: false, error: "Failed to update project" }
  }
}

export async function deleteProject(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { domainId: true },
    })

    await prisma.project.delete({
      where: { id: projectId },
    })

    if (project?.domainId) {
      revalidatePath(`/domain/${project.domainId}`)
    }
    return { success: true }
  } catch (error) {
    console.error("Server Action: Error deleting project:", error)
    return { success: false, error: "Failed to delete project" }
  }
}

export async function getTasks(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: tasks }
  } catch (error) {
    console.error("  Server Action: Error fetching tasks:", error)
    return { success: false, error: "Failed to fetch tasks" }
  }
}

export async function createTask(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const notes = formData.get("notes") as string
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH"
    const deadline = formData.get("deadline") as string
    const projectId = formData.get("projectId") as string
    const domainId = formData.get("domainId") as string
    const goalId = formData.get("goalId") as string

    const task = await prisma.task.create({
      data: {
        title,
        description,
        notes,
        priority,
        deadline: deadline ? new Date(deadline) : null,
        projectId,
        domainId,
        goalId,
        userId: "68a8c4c77a9438a9701ceffa",
        completed: false,
      },
    })

    revalidatePath(`/project/${projectId}`)
    return { success: true, data: task }
  } catch (error) {
    console.error("  Server Action: Error creating task:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function updateTask(taskId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const notes = formData.get("notes") as string
    const priority = formData.get("priority") as "LOW" | "MEDIUM" | "HIGH"
    const deadline = formData.get("deadline") as string

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        notes,
        priority,
        deadline: deadline ? new Date(deadline) : null,
      },
    })

    const projectId = task.projectId
    if (projectId) {
      revalidatePath(`/project/${projectId}`)
    }
    return { success: true, data: task }
  } catch (error) {
    console.error("Server Action: Error updating task:", error)
    return { success: false, error: "Failed to update task" }
  }
}

export async function deleteTask(taskId: string) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    })

    await prisma.task.delete({
      where: { id: taskId },
    })

    if (task?.projectId) {
      revalidatePath(`/project/${task.projectId}`)
    }
    return { success: true }
  } catch (error) {
    console.error("Server Action: Error deleting task:", error)
    return { success: false, error: "Failed to delete task" }
  }
}

export async function toggleTask(taskId: string, completed: boolean, projectId?: string) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    if (projectId) {
      revalidatePath(`/project/${projectId}`)
    }
    return { success: true, data: task }
  } catch (error) {
    console.error("  Server Action: Error toggling task:", error)
    return { success: false, error: "Failed to update task" }
  }
}

export async function getGoalProgress(goalId: string) {
  try {
    const [domains, projects, tasks] = await Promise.all([
      prisma.domain.findMany({
        where: { goalId },
        select: { status: true },
      }),
      prisma.project.findMany({
        where: { goalId },
        select: { status: true },
      }),
      prisma.task.findMany({
        where: { goalId },
        select: { completed: true },
      }),
    ])

    const completedDomains = domains.filter((d) => d.status === "COMPLETED").length
    const completedProjects = projects.filter((p) => p.status === "COMPLETED").length
    const completedTasks = tasks.filter((t) => t.completed).length

    const totalChildren = domains.length + projects.length + tasks.length
    const completedChildren = completedDomains + completedProjects + completedTasks

    return {
      success: true,
      data: {
        domains: { total: domains.length, completed: completedDomains },
        projects: { total: projects.length, completed: completedProjects },
        tasks: { total: tasks.length, completed: completedTasks },
        overall: { total: totalChildren, completed: completedChildren },
        progress: totalChildren > 0 ? Math.round((completedChildren / totalChildren) * 100) : 0,
      },
    }
  } catch (error) {
    console.error("Server Action: Error fetching goal progress:", error)
    return { success: false, error: "Failed to fetch goal progress" }
  }
}

export async function getDomainProgress(domainId: string) {
  try {
    const [projects, tasks] = await Promise.all([
      prisma.project.findMany({
        where: { domainId },
        select: { status: true },
      }),
      prisma.task.findMany({
        where: { domainId },
        select: { completed: true },
      }),
    ])

    const completedProjects = projects.filter((p) => p.status === "COMPLETED").length
    const completedTasks = tasks.filter((t) => t.completed).length

    const totalChildren = projects.length + tasks.length
    const completedChildren = completedProjects + completedTasks

    return {
      success: true,
      data: {
        projects: { total: projects.length, completed: completedProjects },
        tasks: { total: tasks.length, completed: completedTasks },
        overall: { total: totalChildren, completed: completedChildren },
        progress: totalChildren > 0 ? Math.round((completedChildren / totalChildren) * 100) : 0,
      },
    }
  } catch (error) {
    console.error("Server Action: Error fetching domain progress:", error)
    return { success: false, error: "Failed to fetch domain progress" }
  }
}

export async function getProjectProgress(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { completed: true },
    })

    const completedTasks = tasks.filter((t) => t.completed).length

    return {
      success: true,
      data: {
        tasks: { total: tasks.length, completed: completedTasks },
        overall: { total: tasks.length, completed: completedTasks },
        progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
      },
    }
  } catch (error) {
    console.error("Server Action: Error fetching project progress:", error)
    return { success: false, error: "Failed to fetch project progress" }
  }
}

export async function getDashboardStats() {
  try {
    const userId = "68a8c4c77a9438a9701ceffa"

    const [goals, domains, projects, tasks] = await Promise.all([
      prisma.goal.findMany({
        where: { userId },
        select: { status: true },
      }),
      prisma.domain.findMany({
        where: { userId },
        select: { status: true },
      }),
      prisma.project.findMany({
        where: { userId },
        select: { status: true },
      }),
      prisma.task.findMany({
        where: { userId },
        select: { completed: true, deadline: true },
      }),
    ])

    const activeGoals = goals.filter((g) => g.status === "IN_PROGRESS").length
    const completedGoals = goals.filter((g) => g.status === "COMPLETED").length
    const totalProjects = projects.length
    const completedProjects = projects.filter((p) => p.status === "COMPLETED").length
    const completedTasks = tasks.filter((t) => t.completed).length
    const totalTasks = tasks.length

    // Calculate overdue tasks
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const overdueTasks = tasks.filter((t) => !t.completed && t.deadline && new Date(t.deadline) < today).length

    return {
      success: true,
      data: {
        goals: { total: goals.length, active: activeGoals, completed: completedGoals },
        domains: { total: domains.length },
        projects: { total: totalProjects, completed: completedProjects },
        tasks: { total: totalTasks, completed: completedTasks, overdue: overdueTasks },
      },
    }
  } catch (error) {
    console.error("Server Action: Error fetching dashboard stats:", error)
    return { success: false, error: "Failed to fetch dashboard stats" }
  }
}

export async function getTodaysTasks() {
  try {
    const userId = "68a8c4c77a9438a9701ceffa"
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        deadline: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        project: {
          select: { title: true },
        },
      },
      orderBy: { priority: "desc" },
    })

    return { success: true, data: tasks }
  } catch (error) {
    console.error("Server Action: Error fetching today's tasks:", error)
    return { success: false, error: "Failed to fetch today's tasks" }
  }
}

export async function getRecentProjects() {
  try {
    const userId = "68a8c4c77a9438a9701ceffa"

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        domain: {
          select: { title: true },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    // Get progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const progressResult = await getProjectProgress(project.id)
        return {
          ...project,
          progressData: progressResult.success ? progressResult.data : null,
        }
      }),
    )

    return { success: true, data: projectsWithProgress }
  } catch (error) {
    console.error("Server Action: Error fetching recent projects:", error)
    return { success: false, error: "Failed to fetch recent projects" }
  }
}

export async function getUpcomingTasks() {
  try {
    const userId = "68a8c4c77a9438a9701ceffa"
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        completed: false,
        deadline: {
          gte: today,
          lte: nextWeek,
        },
      },
      include: {
        project: {
          select: { title: true },
        },
      },
      orderBy: [{ deadline: "asc" }, { priority: "desc" }],
      take: 10,
    })

    return { success: true, data: tasks }
  } catch (error) {
    console.error("Server Action: Error fetching upcoming tasks:", error)
    return { success: false, error: "Failed to fetch upcoming tasks" }
  }
}
