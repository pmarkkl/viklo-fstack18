import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'
import { initializeSpecies } from './reducers/speciesReducer'
import { initializeUser } from './reducers/userReducer'
import { initLocation } from './reducers/locationReducer'
import ObservationList from './components/ObservationList'
import NewObservation from './components/NewObservation'
import LoginForm from './components/LoginForm'
import Map from './components/Map'

class App extends React.Component {

  componentWillMount() {
    this.props.initializeObservations()
    this.props.initializeSpecies()
    this.props.initLocation()
    const loggedIn = window.localStorage.getItem('loggedInUser')
    const parsed = JSON.parse(loggedIn)
    if (parsed) {
      this.props.initializeUser(parsed)
    }
  }

  render() {
    return (
      <div>
        <LoginForm />
        <h1>Viklo 0.1</h1>
        <NewObservation />
        <ObservationList />
        <Map observations={this.props.observations} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    observations: state.observations
  }
}

export default connect(
  mapStateToProps,
  { initializeObservations, initializeSpecies, initializeUser, initLocation }
)(App)