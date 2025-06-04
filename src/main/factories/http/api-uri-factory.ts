export const makeApiUrl = (path: string): string => {
  if (path.includes('/fk-on')) {
    return `http://localhost:5050${path}`
  }
  return `${process.env.API_URL}${path}`
}
