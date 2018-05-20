
export const setToken = (newToken) => {
  const token = `bearer ${newToken}`
  const config = {
    headers: { 'Authorization': token }
  }
  return config
}