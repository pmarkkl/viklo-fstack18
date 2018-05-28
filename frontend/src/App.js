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
import Activation from './components/Activation'
import ReSend from './components/ReSend'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { logout } from './reducers/userReducer'
import { MapContainerComponent } from './components/observation/Map';

class App extends React.Component {

  state = {
    popup: false,
    loginLogoutColour: '#501B1D'
  }

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

  logout = (event) => {
    window.localStorage.removeItem('loggedInUser')
    this.props.logout()
  }


  render() {

    return (
      <Router>
        <div>
          <div id="header">
            <div id="headerLeft">
              <img src={require('./logouuu.png')} alt="viklo" />
            </div>
            <div id="headerRight">
              <ul>
                <li><Link to="/">Etusivu</Link></li>
                <li><Link to="/uusihavainto">Lisää</Link></li>
                <li><Link to="/havainnot">Havainnot</Link></li>
                <li><Link to="/lajit">Lajit</Link></li>
                <li><Link to="/omasivu">Profiili</Link></li>
                <li id="jees"><Link to="/" onClick={this.logout}>Kirjaudu ulos</Link></li>
              </ul>
            </div>
          </div>
          <div id="main">
            <Route exact path="/" render={() => <LoginForm logout={this.logout} />} />
            <Route exact path="/uusihavainto" render={() => <NewObservation />} />
            <Route exact path="/havainnot" render={() => <ObservationList />} />
            <Route exact path="/lajit" render={() => <AddSpecies />} /> 
            <Route exact path="/omasivu" render={() => <MyPage />} />
            <Route exact path="/yllapito" render={() => <MapContainerComponent /> } />
            <Route exact path="/activation/:id" render={({ match }) => <Activation match={match} />} />
            <Route exact path="/resend" render={() => <ReSend user={this.props.user} />} />
          </div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    observations: state.observations,
    user: state.user
  }
}

export default connect(
  mapStateToProps,
  { initializeObservations, initializeSpecies, initializeUser, initLocation, setMarkers, initFriends, initRequests, logout }
)(App)