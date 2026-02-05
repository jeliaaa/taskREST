import axios from "axios"
import toast from "react-hot-toast"

const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data

    if (typeof data === "object" && !Array.isArray(data)) {
      const fieldErrors = Object.entries(data).map(([field, messages]: [string, any]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(", ")}`
        }
        return `${field}: ${messages}`
      })
      if (fieldErrors.length > 0) return fieldErrors.join("\n")
    }

    if (data.detail) return data.detail
    if (data.message) return data.message
    if (typeof data === "string") return data
  }

  return error?.message || "An error occurred"
}

// Helper function to create Axios instance for a specific API version
const createAxiosInstance = (version: string) => {
    const instance = axios.create({
        baseURL: `${import.meta.env.VITE_BACKEND_APP_URL}/api/${version}`,
    })

    instance.interceptors.request.use(
        (config) => {
            const accessToken = localStorage.getItem("access")

            if (accessToken) {
                config.headers = config.headers || {}
                config.headers.Authorization = `Bearer ${accessToken}`
            }

            // Default to JSON unless explicitly overridden
            if (
                config.data &&
                !(config.data instanceof FormData) &&
                !config.headers?.["Content-Type"]
            ) {
                config.headers["Content-Type"] = "application/json"
            }

            return config
        },
        (error) => Promise.reject(error)
    )

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const errorMessage = getErrorMessage(error)
            toast.error(errorMessage)
            return Promise.reject(error)
        }
    )

    return instance
}

// Export instances for different versions
export const apiV1 = createAxiosInstance("v1")
