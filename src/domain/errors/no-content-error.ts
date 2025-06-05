export class NoContentError extends Error {
  constructor (message?: string) {
    super(message || 'Dados não encontrados!')
    this.name = 'NoContentError'
  }
}
