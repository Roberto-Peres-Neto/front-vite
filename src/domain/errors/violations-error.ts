import type { ProfiledMessageType } from "@/data/models/profiled-message-model"

/* istanbul ignore next */
export class ViolationsError extends Error {
  errorBody: ProfiledMessageType
  constructor (responseBody?: any) {
    super()
    this.errorBody = responseBody
  }
}
