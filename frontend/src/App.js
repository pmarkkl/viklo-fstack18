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
import { logout } from './reducers/userReducer'
import { MapContainerComponent } from './components/observation/Map';

class App extends React.Component {

  state = {
    popup: false,
    loginLogoutColour: '#07889b'
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

  changeColourHover = (event) => {
    event.preventDefault()
    this.setState({ loginLogoutColour: '#22abbf' })
  }

  changeColourLeave = (event) => {
    event.preventDefault()
    this.setState({ loginLogoutColour: '#07889b' })
  }

  render() {
    const adminStyle = {
      backgroundColor: '#3d535c',
      marginTop: '10px',
      display: this.props.user.admin ? '' : 'none'
    }

    const logOutStyle = {
      marginTop: '10px',
      backgroundColor: '#7395AE',
      display: this.props.user.id ? '' : 'none'
    }

    let loginLogout = {
      float: 'right',
      link: {
        backgroundColor: this.state.loginLogoutColour
      }
    }

    const testi = {
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.6)'
    }

    return (
      <Router>
        <div>
          <div id="header">
            <div id="headerLeft">
              <img src={require('./logouuu.png')} alt="viklo" />
            </div>
            <div id="headerRight">
              <ul>
                <li onMouseEnter={this.changeColourHover} onMouseLeave={this.changeColourLeave} style={loginLogout}><Link to="/" onClick={this.logout} style={loginLogout.link}>Kirjaudu ulos</Link></li>
                <li><Link to="/">Etusivu</Link></li>
                <li><Link to="/uusihavainto">Lisää</Link></li>
                <li><Link to="/havainnot">Havainnot</Link></li>
                <li><Link to="/lajit">Lajit</Link></li>
                <li><Link to="/omasivu">Profiili</Link></li>
              </ul>
            </div>
          </div>
          <div id="main">
            <Route exact path="/" render={() => <LoginForm />} />
            <Route path="/uusihavainto" render={() => <NewObservation />} />
            <Route path="/havainnot" render={() => <ObservationList />} />
            <Route path="/lajit" render={() => <AddSpecies />} /> 
            <Route path="/omasivu" render={() => <MyPage />} />
            <Route path="/yllapito" render={() => <MapContainerComponent />} />
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