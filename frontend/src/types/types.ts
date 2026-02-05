export type Priority = "LOW" | "MEDIUM" | "HIGH"
export type Task = {
    id: number
    title: string
    description: string
    is_done: boolean
    priority: Priority
    created_at: string
    due_date?: string | null
    owner: {
        id: number
        username: string
    }
}
