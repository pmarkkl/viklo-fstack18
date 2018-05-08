import React from 'react'
import { connect } from 'react-redux'
import { initializeObservations } from './reducers/observationReducer'

class App extends React.Component {

  componentWillMount() {
    this.props.initializeObservations()
  }

  render() {
    return (
      <div>
        <h1>Viklo</h1>
      </div>
    )
  }
}

export default connect(
  null,
  { initializeObservations }
)(App)