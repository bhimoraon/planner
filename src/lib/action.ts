"use server"

import { prisma } from "./prisma"
import { revalidatePath } from "next/cache"

export async function getGoals() {
  try {
    console.log("[v0] Server Action: Fetching goals from database")
    const goals = await prisma.goal.findMany({
      where: { userId: "68a8c4c77a9438a9701ceffa" },
      orderBy: { createdAt: "desc" },
    })
    console.log("[v0] Server Action: Found goals:", goals.length)
    return { success: true, data: goals }
  } catch (error) {
    console.error("[v0] Server Action: Error fetching goals:", error)
    return { success: false, error: "Failed to fetch goals" }
  }
}

export async function createGoal(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const deadline = formData.get("deadline") as string

    console.log("[v0] Server Action: Creating goal:", { title, description, deadline })

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

    console.log("[v0] Server Action: Created goal:", goal.id)
    revalidatePath("/")
    return { success: true, data: goal }
  } catch (error) {
    console.error("[v0] Server Action: Error creating goal:", error)
    return { success: false, error: "Failed to create goal" }
  }
}

export async function getDomains(goalId: string) {
  try {
    console.log("[v0] Server Action: Fetching domains for goal:", goalId)
    const domains = await prisma.domain.findMany({
      where: { goalId },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: domains }
  } catch (error) {
    console.error("[v0] Server Action: Error fetching domains:", error)
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

    revalidatePath(`/goal/${goalId}/domains`)
    return { success: true, data: domain }
  } catch (error) {
    console.error("[v0] Server Action: Error creating domain:", error)
    return { success: false, error: "Failed to create domain" }
  }
}

export async function getProjects(domainId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: { domainId },
      orderBy: { createdAt: "desc" },
    })
    return { success: true, data: projects }
  } catch (error) {
    console.error("[v0] Server Action: Error fetching projects:", error)
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
    console.log("[v0] Server Action: Created project:", project.id)

    revalidatePath(`/goal/${goalId}/domain/${domainId}/projects`)
    return { success: true, data: project }
  } catch (error) {
    console.error("[v0] Server Action: Error creating project:", error)
    return { success: false, error: "Failed to create project" }
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
    console.error("[v0] Server Action: Error fetching tasks:", error)
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

    revalidatePath(`/goal/${goalId}/domain/${domainId}/project/${projectId}/tasks`)
    return { success: true, data: task }
  } catch (error) {
    console.error("[v0] Server Action: Error creating task:", error)
    return { success: false, error: "Failed to create task" }
  }
}

export async function toggleTask(taskId: string, completed: boolean) {
  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: { completed },
    })
    return { success: true, data: task }
  } catch (error) {
    console.error("[v0] Server Action: Error toggling task:", error)
    return { success: false, error: "Failed to update task" }
  }
}
