import axios from 'axios'

const url = 'http://localhost:3001/api/users'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const newUser = async (data) => {
  const userObject = {
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    password: data.password
  }
  
  try {
    const response = await axios.post(url, userObject)
    return response.data
  } catch (exc) {
    return exc.response.data
  }

}

const fetchUserData = async (id) => {
  const response = await axios.get(`${url}/${id}`)
  return response.data
}

export default {
  getAll, newUser, fetchUserData
}