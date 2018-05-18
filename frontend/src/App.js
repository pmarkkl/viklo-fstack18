import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'
import { initializeSpecies } from './reducers/speciesReducer'
import ObservationList from './components/ObservationList'
import NewObservation from './components/NewObservation'
import LoginForm from './components/LoginForm'

class App extends React.Component {

  componentWillMount() {
    this.props.initializeObservations()
    this.props.initializeSpecies()
  }

  render() {
    return (
      <div>
        <h1>Tervetuloa {this.props.user.email}</h1>
        <LoginForm />
        <h1>Viklo 0.1</h1>
        <NewObservation />
        <ObservationList />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { initializeObservations, initializeSpecies }
)(App)