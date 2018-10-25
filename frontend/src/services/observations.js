import axios from 'axios'
import { setToken } from './helpers'
const url = 'http://localhost:3001/api/observations'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const newObservation = async (request) => {
  try {
    const config = await setToken(request.token)
    const observationObject = {
      latitude: request.latitude,
      longitude: request.longitude,
      date: request.date,
      additionalComments: request.additionalComments,
      speciesId: request.species,
      zipcode: request.zipcode,
      town: request.town,
      sex: request.sex,
      number: request.number
    }

    const response = await axios.post(url, observationObject, config)
    return response.data 
  } catch (exc) {
    return exc.response.data
  }
}

const like = async (request) => {
  try {
  const config = await setToken(request.user.token)
  const object = {
    observation: request.observation
  }
  const response = await axios.post(`${url}/like`, object, config)
  console.log('response', response)
  } catch (exc) {
    return exc.response.data
  }
}

const remove = async (request) => {
  try {
    const config = await setToken(request.user.token)
    const object = {
      observation: request.observation
    }
    const response = await axios.delete(url, object, config)
    console.log(response)
  } catch (exc) {
    console.log(exc)
    return exc
  }
}

export default {
  getAll, newObservation, like, remove
}