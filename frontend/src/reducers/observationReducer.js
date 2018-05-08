import observationService from '../services/observations'

const observationReducer = (state = [], action) => {
  console.log('ACTION: ', action)
  switch (action.type) {
    case 'INIT_OBSERVATIONS':
      return action.data
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

export default observationReducer