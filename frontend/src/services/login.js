import axios from 'axios'
const url = 'http://localhost:3001/api/login'

const login = async (credentials) => {
  console.log(credentials)
  const response = await axios.post(url, credentials)
  console.log(response.data)
  return response.data
}

export default { login }