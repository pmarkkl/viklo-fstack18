import userService from '../services/users'

const friendsReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_FRIENDS':
      return action.data
    default:
      return state
  }
}

export const initFriends = (id) => {
  return async (dispatch) => {
    const userData = await userService.fetchUserData(id)
    dispatch({
      type: 'INIT_FRIENDS',
      data: userData.friends
    })
  }
}

export default friendsReducer