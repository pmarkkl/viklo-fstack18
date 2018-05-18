import axios from 'axios'
const url = 'http://localhost:3001/api/observations'

let token = null

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const setToken = (newToken) => {
  token = `bearer ${newToken}`
  return token
}

const newObservation = async (request) => {

  const token = setToken(request.token)

  const config = {
    headers: { 'Authorization': token }
  }

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