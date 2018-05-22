import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'
import { initializeSpecies } from './reducers/speciesReducer'
import { initializeUser } from './reducers/userReducer'
import { initLocation } from './reducers/locationReducer'
import { setMarkers } from './reducers/markerReducer'
import { initFriends } from './reducers/friendsReducer'
import { initRequests } from './reducers/requestsReducer'
import ObservationList from './components/observation/ObservationList'
import LoginForm from './components/LoginForm'
import NewObservation from './components/observation/NewObservation'
import AddSpecies from './components/AddSpecies'
import MyPage from './components/MyPage'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class App extends React.Component {

  componentWillMount() {
    this.props.initializeObservations()
    this.props.initializeSpecies()
    this.props.initLocation()
    this.props.setMarkers()
    const loggedIn = window.localStorage.getItem('loggedInUser')
    const parsed = JSON.parse(loggedIn)
    if (parsed) {
      this.props.initializeUser(parsed)
      this.props.initFriends(parsed.id)
      this.props.initRequests(parsed.id)
    }
  }

  render() {

    return (
      <Router>
      <div>
        <div id="vasen">
        <img src={require('./logooo.png')} alt="viklo" />
          <ul>
            <li><Link to="/">Etusivu</Link></li>
            <li><Link to="/uusihavainto">Uusi havainto</Link></li>
            <li><Link to="/havainnot">Havainnot</Link></li>
            <li><Link to="/lajit">Lisää laji</Link></li>
            <li><Link to="/omasivu">Oma sivu</Link></li>
          </ul>
          <br />
          <ul id="admin">
            <li><Link to="/yllapito">Ylläpito</Link></li>
          </ul>
        </div>
        <div id="oikea">
          <div id="jes">
            <Route exact path="/" render={() => <LoginForm />} />
            <Route path="/uusihavainto" render={() => <NewObservation />} />
            <Route path="/havainnot" render={() => <ObservationList />} />
            <Route path="/lajit" render={() => <AddSpecies />} /> 
            <Route path="/omasivu" render={() => <MyPage />} />
          </div>
        </div>
      </div>
      </Router>
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
  { initializeObservations, initializeSpecies, initializeUser, initLocation, setMarkers, initFriends, initRequests }
)(App)