import axios from 'axios'
import { setToken } from './helpers'

const url = 'http://localhost:3001/api/species'

const getAll = async () => {
  const response = await axios.get(url)
  return response.data
}

const addSpecies = async (request) => {
  console.log('mikäs helvetti tämä on tääll', request)
  const config = await setToken(request.token)
  const speciesObject = {
    finnishName: request.finnishName,
    latinName: request.latinName
  }
  const response = await axios.post(url, speciesObject, config)
  return response.data
}

export default {
  getAll, addSpecies
}