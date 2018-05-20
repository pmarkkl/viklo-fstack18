import speciesService from '../services/species'

const speciesReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_SPECIES':
      return action.data
    case 'NEW_SPECIES':
      return [...state, action.data]
    default:
      return state
  }
}

export const initializeSpecies = () => {
  return async (dispatch) => {
    const species = await speciesService.getAll()
    dispatch({
      type: 'INIT_SPECIES',
      data: species
    })
  }
}

export const addSpecies = (species) => {
  return async (dispatch) => {
    dispatch({
      type: 'NEW_SPECIES',
      data: species
    })
  }
}

export default speciesReducer