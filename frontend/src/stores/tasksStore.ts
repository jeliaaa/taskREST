import { create } from "zustand"
import { apiV1 } from "../utils/axios"
import { getErrorMessage } from "../utils/errorHandler"
import type { Task } from "../types/types"

type TaskState = {
  tasks: Task[]
  loading: boolean
  error: string | null

  fetchTasks: () => Promise<void>
  createTask: (data: Partial<Task>) => Promise<void>
  updateTask: (id: number, data: Partial<Task>) => Promise<void>
  deleteTask: (id: number) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const res = await apiV1.get("/tasks/", { params: { ordering: "-created_at" } })
      set({ tasks: res.data, loading: false })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage, loading: false })
      throw new Error(errorMessage)
    }
  },

  createTask: async (data) => {
    try {
      const res = await apiV1.post("/tasks/", data)
      set({ tasks: [res.data, ...get().tasks], error: null })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage })
      throw new Error(errorMessage)
    }
  },

  updateTask: async (id, data) => {
    try {
      const res = await apiV1.patch(`/tasks/${id}/`, data)
      set({
        tasks: get().tasks.map((t) => (t.id === id ? res.data : t)),
        error: null,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage })
      throw new Error(errorMessage)
    }
  },

  deleteTask: async (id) => {
    try {
      await apiV1.delete(`/tasks/${id}/`)
      set({
        tasks: get().tasks.filter((t) => t.id !== id),
        error: null,
      })
    } catch (err) {
      const errorMessage = getErrorMessage(err)
      set({ error: errorMessage })
      throw new Error(errorMessage)
    }
  },
}))
