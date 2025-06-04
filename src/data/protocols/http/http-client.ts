import type { HttpRequest } from "./http-request";
import type { HttpResponse } from "./http-response";


export interface HttpClient<R = any> {
  request: (data: HttpRequest) => Promise<HttpResponse<R>>
}