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
import ResetPassword from './components/ResetPassword'
import SetPasswordReset from './components/SetPasswordReset'
import SingleMarkerMap from './components/observation/SingleMarkerMap'
import Info from './components/Info'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { logout } from './reducers/userReducer'
import { MapContainerComponent } from './components/observation/Map'
import Flexbox from 'flexbox-react'

class App extends React.Component {

  state = {
    popup: false,
    loginLogoutColour: '#501B1D'
  }

  componentWillMount() {
    this.props.initializeObservations()
    this.props.initializeSpecies()
    this.props.initLocation()
    const loggedIn = window.localStorage.getItem('loggedInUser')
    const parsed = JSON.parse(loggedIn)
    if (parsed) {
      this.props.initializeUser(parsed)
      console.log('parsed', parsed)
/*       this.props.initFriends(parsed.id)
      this.props.initRequests(parsed.id) */
    }
  }

  logout = (event) => {
    window.localStorage.removeItem('loggedInUser')
    this.props.logout()
  }



  render() {

    const visibility = {
      display: this.props.user.activated ? '' : 'none'
    }

    const mainDivStyle = {
      margin: '0px auto',
      marginTop: '70px',
      marginBottom: '40px',
      display: 'inline-block',
      width: '1000px',
      height: 'auto',
      backgroundColor: 'white',
      border: '1px solid #EEEEEE',
      boxShadow: '2px 2px 2px #ebebeb',
      padding: '25px',
      alignSelf: 'flex-start'
    }

    const footerDivStyle = {
      margin: '0px auto',
    }

    return (
      <Router>
        <Flexbox flexDirection="column" minHeight="100vh">
          <Flexbox className="headerDiv" element="header" height="40px">
            <div className="headerLeft">
            </div>
            <div className="headerRight">
                <ul>
                  <li className="navLink"><Link to="/">Etusivu</Link></li>
                  <li className="navLink"><Link to="/uusihavainto">Lisää</Link></li>
                  <li className="navLink"><Link to="/havainnot">Havainnot</Link></li>
                  <li className="navLink"><Link to="/omasivu">Käyttäjähallinta</Link></li>
                  <li className="logout" style={visibility}><Link to="/" onClick={this.logout}>Kirjaudu ulos</Link></li>
                </ul>
              </div>
          </Flexbox>
 
          <Flexbox flexGrow={1} width="1000">
            <div style={mainDivStyle}>
              <Route exact path="/" render={() => <LoginForm />} />
              <Route exact path="/uusihavainto" render={() => <NewObservation />} />
              <Route exact path="/havainnot" render={() => <ObservationList />} />
              <Route exact path="/lajit" render={() => <AddSpecies />} /> 
              <Route exact path="/omasivu" render={() => <MyPage />} />
              <Route exact path="/yllapito" render={() => <MapContainerComponent /> } />
              <Route exact path="/activation/:id" render={({ match }) => <Activation match={match} />} />
              <Route exact path="/resend" render={() => <ReSend user={this.props.user} />} />
              <Route exact path="/resetpassword" render={() => <ResetPassword />} />
              <Route exact path="/setpassword/:id" render={({ match }) => <SetPasswordReset match={match} />} />
              <Route exact path="/havainnot/:id" render={({ match }) => <SingleMarkerMap id={match.params.id} />} />
              <Route path="/viklo" render={() => <Info />} />
              <Route path="/yhteys" render={() => <div><h1>Ota yhteyttä</h1><p>Ei ihan vielä.</p></div>}/>
            </div>
          </Flexbox>
 
          <Flexbox element="footer">
            <div style={footerDivStyle}>
            <Link to="/viklo">Info</Link> | <Link to="/yhteys">Ota yhteyttä</Link>
            </div>
          </Flexbox>
        </Flexbox>
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