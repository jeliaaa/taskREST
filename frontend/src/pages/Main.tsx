import { useEffect, useMemo, useState } from "react"
import { useTaskStore } from "../stores/tasksStore"
import toast from "react-hot-toast"
import Modal from "../components/ui-elements/Modal"
import { useAuthStore } from "../stores/authStore"
import type { Task } from "../types/types"

type FilterStatus = "all" | "done" | "pending"
type SortBy = "created" | "due" | "priority"

const priorityOrder: Record<Task["priority"], number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
}

export default function Main() {
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask } = useTaskStore()
  const { isAuthenticated } = useAuthStore();
  const [filter, setFilter] = useState<FilterStatus>("all")
  const [sortBy, setSortBy] = useState<SortBy>("created")
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "MEDIUM" as Task["priority"], due_date: "" })

  const TASKS_PER_PAGE = 3

  useEffect(() => {
    if (isAuthenticated) { 
      fetchTasks().catch(() => {})
    }
  }, [fetchTasks, isAuthenticated])

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return toast.error("Title cannot be empty")
    // if (newTask.due_date && new Date(newTask.due_date) < new Date()) return toast.error("Due date cannot be in the past")

    await createTask(newTask).catch((error) => {toast.error("Failed to create task: " + error.message)})
    toast.success("Task created")
    setNewTask({ title: "", description: "", priority: "MEDIUM", due_date: "" })
    setIsModalOpen(false)
    setCurrentPage(1)
  }

  const handleToggleDone = async (task: Task) => {
    await updateTask(task.id, { is_done: !task.is_done })
  }

  const handleDelete = async (task: Task) => {
    if (!confirm("Are you sure you want to delete this task?")) return
    await deleteTask(task.id)
    toast.success("Task deleted")
  }

  const visibleTasks = useMemo(() => {
    let result = [...tasks]

    if (filter === "done") result = result.filter((t) => t.is_done)
    else if (filter === "pending") result = result.filter((t) => !t.is_done)

    if (search.trim()) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sortBy === "created") result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    else if (sortBy === "due") result.sort((a, b) => {
      if (!a.due_date) return 1
      if (!b.due_date) return -1
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    })
    else if (sortBy === "priority") result.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])

    return result
  }, [tasks, filter, sortBy, search])

  const totalPages = Math.ceil(visibleTasks.length / TASKS_PER_PAGE)
  const paginatedTasks = visibleTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  )

  const handleFilterChange = (newFilter: FilterStatus) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: SortBy) => {
    setSortBy(newSort)
    setCurrentPage(1)
  }

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch)
    setCurrentPage(1)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto text-blue-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
        >
          + New Task
        </button>
      </div>

      {/* NEW TASK MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCreateTask}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition"
            >
              Create Task
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* CONTROLS */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <select value={filter} onChange={(e) => handleFilterChange(e.target.value as FilterStatus)} className="border px-2 py-1">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
        <select value={sortBy} onChange={(e) => handleSortChange(e.target.value as SortBy)} className="border px-2 py-1">
          <option value="created">Created date</option>
          <option value="due">Due date</option>
          <option value="priority">Priority</option>
        </select>
        <input type="text" placeholder="Search..." value={search} onChange={(e) => handleSearchChange(e.target.value)} className="border px-2 py-1" />
      </div>

      {/* TASK LIST */}
      {loading ? (
        <p className="text-gray-500 text-center">Loading tasks...</p>
      ) : (
        <>
          <ul className="space-y-3">
            {paginatedTasks.map((task) => (
              <li key={task.id} className="border p-4 rounded flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  {task.description && <p className="text-sm text-white">{task.description}</p>}
                  <p className="text-xs text-gray-100">Priority: {task.priority}</p>
                  {task.due_date && <p className="text-xs text-gray-200">Due: {task.due_date}</p>}
                  <p className="text-xs text-gray-400">Owner: {task.owner?.username || "You"}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <button onClick={() => handleToggleDone(task)} className={`px-2 py-1 rounded text-white ${task.is_done ? "bg-green-600" : "bg-yellow-600"}`}>
                    {task.is_done ? "Done" : "Pending"}
                  </button>
                  <button onClick={() => handleDelete(task)} className="px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                </div>
              </li>
            ))}
          </ul>

          {/* PAGINATION */}
          {visibleTasks.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 w-10 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded"
              >
                Next
              </button>
              <span className="text-sm text-white">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </>
      )}

      {!loading && visibleTasks.length === 0 && <p className="text-gray-500 mt-6 text-center">No tasks found.</p>}
    </div>
  )
}
