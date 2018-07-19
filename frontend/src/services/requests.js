
import axios from 'axios'
const url = 'http://localhost:3001/api/requests'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const findRequests = async (id) => {
  const response = await axios.get(`${url}/user/${id}`)
  const userRequests = response.data.filter(response => response.sent === id || response.received === id)
  return userRequests
}

export default {
  getAll, findRequests
}