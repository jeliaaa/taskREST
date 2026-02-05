import axios from "axios"

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseData: any = error.response?.data

    if (responseData) {
      // Handle field-level errors
      if (typeof responseData === "object" && !Array.isArray(responseData)) {
        const fieldErrors = Object.entries(responseData).map(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) return `${field}: ${messages.join(", ")}`
          return `${field}: ${messages}`
        })
        if (fieldErrors.length > 0) return fieldErrors.join("\n")
      }

      // Handle standard DRF keys
      if (responseData.detail) return responseData.detail
      if (responseData.message) return responseData.message
      if (Array.isArray(responseData.non_field_errors)) return responseData.non_field_errors.join(", ")
      if (typeof responseData === "string") return responseData
    }

    return error.message || `Error: ${error.response?.status || "Unknown"}`
  }

  if (error instanceof Error) return error.message

  return "An unknown error occurred"
}
