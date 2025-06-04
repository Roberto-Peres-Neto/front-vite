export type ProfiledMessageType = {
  error: string
  violations: ProfiledMessage[]
}

export type ProfiledMessage = {
  type: string
  message: string
}
