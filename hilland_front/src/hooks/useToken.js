export const useToken = () => {
  const storedUser = localStorage.getItem('loggedUser')

  if (!storedUser) {
    return null
  }

  const { token } = JSON.parse(storedUser)
  const formattedToken = `bearer ${token}`
  return formattedToken
}