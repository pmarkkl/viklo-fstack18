import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'
import { initializeSpecies } from './reducers/speciesReducer'
import { initializeUser } from './reducers/userReducer'
import { initLocation } from './reducers/locationReducer'
import { setMarkers } from './reducers/markerReducer'
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
    }
  }

  render() {

    const profiili = {
      float: 'right'
    }

    return (
      <Router>
      <div id="container">
        <div id="yla">
          <img src={require('./logo2.png')} alt="viklo" />
        </div>
        <div id="testi">
        <ul>
        <li><Link to="/">Etusivu</Link></li>
        <li><Link to="/uusihavainto">Uusi havainto</Link></li>
        <li><Link to="/havainnot">Havainnot</Link></li>
        <li><Link to="/lajit">Lisää laji</Link></li>
        <li style={profiili}><Link to="/omasivu">Oma sivu</Link></li>
                  </ul>
        </div>
        <div id="ala">
          <div id="alaloota">
            <div id="clear">
            </div>
            <div id="leveys">
              <Route exact path="/" render={() => <LoginForm />} />
              <Route path="/uusihavainto" render={() => <div><NewObservation /></div>} />
              <Route path="/havainnot" render={() => <ObservationList />} />
              <Route path="/lajit" render={() => <AddSpecies />} /> 
              <Route path="/omasivu" render={() => <MyPage />} />
          </div>
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
  { initializeObservations, initializeSpecies, initializeUser, initLocation, setMarkers }
)(App)