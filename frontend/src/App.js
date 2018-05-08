import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'
import { initializeUsers } from './reducers/userReducer'
import ObservationList from './components/ObservationList'

class App extends React.Component {

  componentWillMount() {
    this.props.initializeObservations()
    this.props.initializeUsers()
  }

  render() {
    return (
      <div>
        <h1>Viklo</h1>
        <ObservationList />
      </div>
    )
  }
}

export default connect(
  null,
  { initializeObservations, initializeUsers }
)(App)