import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import observationReducer from './reducers/observationReducer'
import userReducer from './reducers/userReducer'
import speciesReducer from './reducers/speciesReducer'
import locationReducer from './reducers/locationReducer'
import markerReducer from './reducers/markerReducer'
import friendsReducer from './reducers/friendsReducer'
import requestsReducer from './reducers/requestsReducer'

const reducer = combineReducers({
  observations: observationReducer,
  user: userReducer,
  species: speciesReducer,
  location: locationReducer,
  markers: markerReducer,
  friends: friendsReducer,
  requests: requestsReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store