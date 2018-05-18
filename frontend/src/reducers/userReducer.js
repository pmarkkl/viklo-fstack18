const userReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.data
    case 'INIT_USER':
      return action.data
    default:
      return state
  }
}

export const initializeUser = (user) => {
  return async (dispatch) => {
    dispatch({
      type: 'INIT_USER',
      data: user
    })
  }
}

export default userReducer