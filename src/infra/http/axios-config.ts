// import { type HttpClient, type HttpRequest, type HttpResponse, HttpStatusCode } from '@/data/protocols/http'
// import axios, { type AxiosResponse } from 'axios'

// export class AxiosHttpClient<T = any> implements HttpClient<T> {
//   async request({ url, method, body, headers, responseType }: HttpRequest): Promise<HttpResponse<T>> {
//     try {
//       const response: AxiosResponse = await axios.request({
//         url,
//         method,
//         data: body,
//         headers,
//         responseType
//       })

//       return {
//         statusCode: response.status,
//         body: response.data
//       }
//     } catch (error: any) {
//       return {
//         statusCode: error?.response?.status || HttpStatusCode.serverError,
//         body: error?.response?.data
//       }
//     }
//   }
// }
import { type HttpClient, type HttpRequest, type HttpResponse } from '@/data/protocols/http'
import axios, { type AxiosResponse } from 'axios'

export class AxiosHttpClient implements HttpClient {
  protected abortController = new AbortController()

  async request (data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse
    try {
      axiosResponse = await axios.request({
        signal: this.abortController.signal,
        url: data.url,
        method: data.method,
        data: data.body,
        headers: data.headers,
        ...(data.responseType ? { responseType: data.responseType } : null)
      })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        axiosResponse = error.response
      } else {
        throw error
      }
    }

    return {
      statusCode: axiosResponse?.status || 500,
      body: axiosResponse?.data || ''
    }
  }
}
