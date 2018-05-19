import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'
import { initializeSpecies } from './reducers/speciesReducer'
import { initializeUser } from './reducers/userReducer'
import { initLocation } from './reducers/locationReducer'
import ObservationList from './components/ObservationList'
import NewObservation from './components/NewObservation'
import LoginForm from './components/LoginForm'
import { MapContainerComponent } from './components/Map'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

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
      <Router>
        <div>
          <div>
            <Link to="/">etusivu</Link>&nbsp;
            <Link to="/kartta">kartta</Link>&nbsp;
            <Link to="/havainnot">havainnot</Link>
          </div>
          <div>
            <Route exact path="/" render={() => <div><h1>Viklo</h1> <LoginForm /></div>} />
            <Route path="/kartta" render={() => <MapContainerComponent observations={this.props.observations} />} />
            <Route path="/havainnot" render={() => <ObservationList />} />
          </div>
        </div>
      </Router>
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