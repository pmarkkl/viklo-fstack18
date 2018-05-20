import axios from 'axios'
import { setToken } from './helpers'
const url = 'http://localhost:3001/api/observations'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const newObservation = async (request) => {
  const config = await setToken(request.token)

  const observationObject = {
    latitude: request.latitude,
    longitude: request.longitude,
    date: Date.now(),
    additionalComments: 'Ehkä menee jopa stateen asti',
    speciesId: request.species
  }

  const response = await axios.post(url, observationObject, config)
  return response.data
}

export default {
  getAll, newObservation
}