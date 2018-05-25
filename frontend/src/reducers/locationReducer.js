const locationReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_LOCATION':
      return action.data 
    case 'SET_LOCATION':
      return action.data
    default:
      return state
  }
}

export const initLocation = () => {
  const data = {
    latitude: 0,
    longitude: 0
  }
  return {
    type: 'INIT_LOCATION',
    data
  }
}

export const setLocation = (data) => {
  return {
    type: 'SET_LOCATION',
    data
  }
}

export default locationReducer