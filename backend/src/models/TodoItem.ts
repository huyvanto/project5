export interface TodoItem {
  userId: string
  todoId: string
  createdAt: string
  location: string
  name: string
  dayTemp: number
  nightTemp: number
  dayForecast: string
  nightForecast: string
  note: string
  attachmentUrl?: string
}
