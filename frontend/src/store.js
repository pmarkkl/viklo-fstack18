import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import observationReducer from './reducers/observationReducer'

const reducer = combineReducers({
  observations: observationReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store