import axios from 'axios'
const url = '/activate'

const activate = async (request) => {
  try {
    const requestObject = {
      token: request.token
    }
    const response = await axios.post(url, requestObject)
    return response.data
  } catch (exc) {
    return exc.response.data
  }
}

const resend = async (request) => {
  try {
    const requestObject = {
      id: request
    }
    const response = await axios.post(`${url}/resend`, requestObject)
    console.log(response.data)
    return response
  } catch (exc) {
    return exc.response.data
  }
}

export default { activate, resend }