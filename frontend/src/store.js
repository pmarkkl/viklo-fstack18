import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import observationReducer from './reducers/observationReducer'
import userReducer from './reducers/userReducer'
import speciesReducer from './reducers/speciesReducer'
import locationReducer from './reducers/locationReducer'

const reducer = combineReducers({
  observations: observationReducer,
  user: userReducer,
  species: speciesReducer,
  location: locationReducer
})

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  )
)

export default store