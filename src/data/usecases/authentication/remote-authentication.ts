import { HttpStatusCode, type HttpClient } from '@/data/protocols/http'
import { AccessDeniedError, NoContentError, UnexpectedError, ViolationsError } from '@/domain'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import type { Authentication } from '@/domain/usecase/login'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<Authentication.Model>,
  ) {}

  async auth (params: Authentication.Params): Promise<Authentication.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: { ...params }
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      case HttpStatusCode.forbidden: throw new AccessDeniedError()
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      case HttpStatusCode.noContent: throw new NoContentError()
      case HttpStatusCode.badRequest: throw new ViolationsError(httpResponse.body)
      default: throw new UnexpectedError()
    }
  }
}
