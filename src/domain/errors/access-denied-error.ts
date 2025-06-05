/* istanbul ignore next */
export class AccessDeniedError extends Error {
  constructor (responseBody?: any) {
    super(responseBody?.error ? responseBody.error : 'Acesso negado!')
    this.name = 'AccessDeniedError'
  }
}
