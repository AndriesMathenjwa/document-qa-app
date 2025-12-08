export interface DocumentItem {
  id: string
  name: string
  size: number
  uploadedAt: string
  status: 'uploading' | 'uploaded' | 'failed'
  progress?: number
  content?: string
}

export interface QAEntry {
  id: string
  documentId: string
  question: string
  answer: string
  createdAt: string
}
