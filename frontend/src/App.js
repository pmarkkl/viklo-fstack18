import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'
import { initializeSpecies } from './reducers/speciesReducer'
import { initializeUser } from './reducers/userReducer'
import { initLocation } from './reducers/locationReducer'
import ObservationList from './components/ObservationList'
import LoginForm from './components/LoginForm'
import NewObservation from './components/NewObservation'
import AddSpecies from './components/AddSpecies'
import MyPage from './components/MyPage'
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

    const profiili = {
      float: 'right'
    }

    return (
      <div id="container">
        <div id="yla">
          <img src={require('./logo.png')} alt="viklo" />
        </div>
        <div id="ala">
            <Router>
              <div id="alaloota">
                <div>
                  <ul>
                  <li><Link to="/">Etusivu</Link></li>
                  <li><Link to="/kartta">Kartta</Link></li>
                  <li><Link to="/havainnot">Havainnot</Link></li>
                  <li><Link to="/lajit">Lisää laji</Link></li>
                  <li style={profiili}><Link to="/omasivu">Oma sivu</Link></li>
                  </ul>
                </div>
                <div id="clear">
                </div>
                <div id="leveys">
                  <Route exact path="/" render={() => <LoginForm />} />
                  <Route path="/kartta" render={() => <div><NewObservation /> <MapContainerComponent observations={this.props.observations} /></div>} />
                  <Route path="/havainnot" render={() => <ObservationList />} />
                  <Route path="/lajit" render={() => <AddSpecies />} /> 
                  <Route path="/omasivu" render={() => <MyPage />} />
                </div>
              </div>
            </Router>
        </div>
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