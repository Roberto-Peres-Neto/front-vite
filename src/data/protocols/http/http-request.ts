import type { ResponseType } from "axios"
import type { HttpMethod } from "./http-method"

export type HttpRequest = {
  url: string
  method: HttpMethod
  body?: any
  headers?: Record<string, string>
  responseType?: ResponseType
}