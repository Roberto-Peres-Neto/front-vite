export const makeApiUrl = (path: string): string => {
  // if (path.includes('/fk-on')) {
  //   return `http://localhost:5050${path}`
  // }
  return `${import.meta.env.VITE_API_URL}${path}`
}
