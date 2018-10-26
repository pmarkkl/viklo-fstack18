import observationService from '../services/observations'

const observationReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_OBSERVATIONS':
      return action.data
    case 'NEW_OBSERVATION':
      return [...state, action.data]
    case 'REMOVE_OBSERVATION':
      return state.filter(observation => observation.id !== action.data)
    default:
      return state
  }
}

export const initializeObservations = () => {
  return async (dispatch) => {
    const observations = await observationService.getAll()
    dispatch({
      type: 'INIT_OBSERVATIONS',
      data: observations
    })
  }
}

export const observationCreation = (data) => {
  return {
    type: 'NEW_OBSERVATION',
    data
  }
}

export const observationRemoval = (data) => {
  console.log(data)
  return {
    type: 'REMOVE_OBSERVATION',
    data
  }
}

export default observationReducer