import axios from "axios";

/**
 * Base URL
 * Gunakan environment variable saat production
 * VITE_API_BASE_URL=http://localhost:8000
 */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Axios instance
 */
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 20000, // 20 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Response interceptor
 * Normalize error response
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      return Promise.reject({
        message:
          error.response.data?.detail ||
          "Server error occurred.",
        status: error.response.status,
      });
    } else if (error.request) {
      // No response
      return Promise.reject({
        message:
          "Network error. Please check your connection.",
        status: 0,
      });
    } else {
      return Promise.reject({
        message: "Unexpected error occurred.",
        status: -1,
      });
    }
  }
);

/**
 * Ask question to backend
 */
export async function askQuestion(question) {
  if (!question || question.trim().length === 0) {
    throw new Error("Question cannot be empty.");
  }

  const response = await apiClient.post("/ask", {
    question: question.trim(),
  });

  return response.data;
}

/**
 * Optional: Health check
 */
export async function checkHealth() {
  const response = await apiClient.get("/health");
  return response.data;
}

/**
 * Optional: OpenAI health check endpoint
 */
export async function checkOpenAIHealth() {
  const response = await apiClient.get("/health/openai");
  return response.data;
}