import axios from 'axios'
const url = '/pwresetvalidity'

const checkValidity = async (request) => {
  try {
    const response = await axios.post(url, request)
    return response.data
  } catch (exc) {
    return exc.response.data
  }
}

export default { checkValidity }