import axios from 'axios'
import { setToken } from './helpers'
const url = '/api/observations'

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
      town: request.town
    }

    const response = await axios.post(url, observationObject, config)
    return response.data 
  } catch (exc) {
    return exc.response.data
  }
}

export default {
  getAll, newObservation
}