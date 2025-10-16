/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_QUESTIONS_URL: string
  readonly VITE_API_ANSWERS_URL: string
  readonly VITE_API_STUDENTS_URL: string
  readonly VITE_API_AI_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
