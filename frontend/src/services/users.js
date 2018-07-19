import axios from 'axios'
import { setToken } from './helpers'
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
    password: data.password,
    passwordConfirmation: data.passwordConfirmation
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

const setPasswordAfterReset = async (passwords) => {
  try {
    const response = await axios.put(`${url}/setreseted`, passwords)
    return response.data
  } catch (exc) {
    return exc.response.data
  }
}

const setContacts = async (request) => {
  try {
    const config = setToken(request.token)
    const response = await axios.put(`${url}/setcontacts`, request, config)
    return response.data
  } catch (exc) {
    return exc.response.data
  }
}

const setPassword = async (request) => {
  try {
    const config = setToken(request.token)
    const response = await axios.put(`${url}/setpassword`, request, config)
    return response.data
  } catch (exc) {
    return exc.response.data
  }
}

const resetPassword = async (email) => {
  const requestObject = {
    email
  }
  try {
    const response = await axios.post(`${url}/resetpassword`, requestObject)
    return response
  } catch (exc) {
    return exc.response.data
  }
}

export default {
  getAll, newUser, fetchUserData, resetPassword, setPasswordAfterReset, setContacts, setPassword
}