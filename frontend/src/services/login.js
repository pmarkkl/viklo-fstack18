import axios from 'axios'
const url = '/api/login'

const login = async (credentials) => {
  try {
    const response = await axios.post(url, credentials)
    return response.data
  } catch (exc) {
    return exc.response.data
  }
}

export default { login }