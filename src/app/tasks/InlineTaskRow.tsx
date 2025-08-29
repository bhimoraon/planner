"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Pencil } from "lucide-react"
import { toggleTask, updateTask } from "@/lib/actions"

type Task = {
    id: string
    title: string
    description: string | null
    completed: boolean
    priority: "LOW" | "MEDIUM" | "HIGH"
    deadline: string | Date | null
    project?: { title?: string | null } | null
}

export default function InlineTaskRow({ task, rightLabel }: { task: Task; rightLabel: string }) {
    const [local, setLocal] = useState({
        title: task.title,
        priority: task.priority,
        completed: task.completed,
    })
    const [editingTitle, setEditingTitle] = useState(false)
    const [editingPriority, setEditingPriority] = useState(false)
    const [saving, setSaving] = useState<"title" | "priority" | "completed" | null>(null)

    const handleToggleCompleted = async () => {
        try {
            setSaving("completed")
            const res = await toggleTask(task.id, !local.completed)
            if (res?.success && res.data) {
                setLocal((s) => ({ ...s, completed: res.data.completed }))
            } else {
                setLocal((s) => ({ ...s, completed: !s.completed })) // optimistic fallback
            }
        } finally {
            setSaving(null)
        }
    }

    const saveTitle = async () => {
        if (!local.title.trim() || local.title === task.title) {
            setEditingTitle(false)
            return
        }
        try {
            setSaving("title")
            const fd = new FormData()
            fd.append("title", local.title)
            fd.append("description", task.description || "")
            fd.append("notes", "") // unchanged
            fd.append("priority", local.priority)
            fd.append("deadline", task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "")
            const res = await updateTask(task.id, fd)
            if (!res?.success) {
                setLocal((s) => ({ ...s, title: task.title }))
            }
        } finally {
            setEditingTitle(false)
            setSaving(null)
        }
    }

    const savePriority = async (value: "LOW" | "MEDIUM" | "HIGH") => {
        try {
            setEditingPriority(false)
            if (value === local.priority) return
            setSaving("priority")
            setLocal((s) => ({ ...s, priority: value })) // optimistic
            const fd = new FormData()
            fd.append("title", local.title)
            fd.append("description", task.description || "")
            fd.append("notes", "")
            fd.append("priority", value)
            fd.append("deadline", task.deadline ? new Date(task.deadline).toISOString().split("T")[0] : "")
            const res = await updateTask(task.id, fd)
            if (!res?.success) {
                setLocal((s) => ({ ...s, priority: task.priority }))
            }
        } finally {
            setSaving(null)
        }
    }

    const priorityBadge = (p: Task["priority"]) =>
        p === "HIGH" ? "destructive" : p === "MEDIUM" ? "default" : "secondary"

    return (
        <div className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
            <div className="mt-1">
                <Checkbox
                    checked={local.completed}
                    onCheckedChange={handleToggleCompleted}
                    aria-label="Mark task complete"
                    disabled={saving === "completed"}
                />
            </div>
            <div className="flex-1 space-y-1">
                {editingTitle ? (
                    <Input
                        autoFocus
                        value={local.title}
                        onChange={(e) => setLocal((s) => ({ ...s, title: e.target.value }))}
                        onBlur={saveTitle}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") saveTitle()
                            if (e.key === "Escape") {
                                setLocal((s) => ({ ...s, title: task.title }))
                                setEditingTitle(false)
                            }
                        }}
                        aria-label="Edit task title"
                    />
                ) : (
                    <div className="flex items-center gap-2">
                        <p className={`font-medium leading-tight ${local.completed ? "line-through text-muted-foreground" : ""}`}>
                            {local.title}
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setEditingTitle(true)}
                            aria-label="Edit title"
                            title="Edit title"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                )}
                {task.project?.title && <p className="text-sm text-muted-foreground">{task.project.title}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
                {editingPriority ? (
                    <Select defaultValue={local.priority} onValueChange={(v: "LOW" | "MEDIUM" | "HIGH") => savePriority(v)}>
                        <SelectTrigger className="h-7 px-2">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                    </Select>
                ) : (
                    <Badge
                        variant={priorityBadge(local.priority)}
                        className="text-xs font-medium cursor-pointer"
                        onClick={() => setEditingPriority(true)}
                        aria-label="Edit priority"
                    >
                        {local.priority}
                    </Badge>
                )}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    <span>{rightLabel}</span>
                </div>
            </div>
        </div>
    )
}
