export class UnexpectedError extends Error {
  constructor () {
    super('Algo de errado ocorreu. Tente novamente mais tarde.')
    this.name = 'UnexpectedError'
  }
}
