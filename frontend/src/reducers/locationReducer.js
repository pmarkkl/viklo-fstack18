const locationReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_LOCATION':
      return action.data
    default:
      return state
  }
}

export const setLocation = (data) => {
  return {
    type: 'SET_LOCATION',
    data
  }
}

export default locationReducer