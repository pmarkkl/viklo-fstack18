import requestService from '../services/requests'

const requestsReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_REQUESTS':
      return action.data
    default:
      return state
  }
}

export const initRequests = (id) => {
  return async (dispatch) => {
    const userData = await requestService.findRequests(id)
    dispatch({
      type: 'INIT_REQUESTS',
      data: userData
    })
  }
}

export default requestsReducer