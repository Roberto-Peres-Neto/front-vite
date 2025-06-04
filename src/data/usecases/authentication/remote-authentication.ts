import { HttpStatusCode, type HttpClient } from '@/data/protocols/http'
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error'
import { UnexpectedError } from '@/domain/errors/unexpected-error'
import { ViolationsError } from '@/domain/errors/violations-error'
import type { Authentication } from '@/domain/usecase/login'
import { type HashAdapter } from '@/infra/cryptography/hash-adapter'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<Authentication.Model>,
    private readonly hasher: HashAdapter
  ) {}

  async auth (params: Authentication.Params): Promise<Authentication.Model> {
    const hashed = await this.hasher.hash(params.password)
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: { ...params, password: hashed }
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body!
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      case HttpStatusCode.badRequest: throw new ViolationsError(httpResponse.body)
      default: throw new UnexpectedError()
    }
  }
}
