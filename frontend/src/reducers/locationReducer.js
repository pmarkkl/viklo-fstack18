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
    latitude: 60.2279004,
    longitude: 25.0270719,
    town: 'Helsinki',
    zipcode: '00790'

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