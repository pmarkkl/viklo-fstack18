import React from 'react'
import { connect } from 'react-redux'
import Observation from '../components/Observation'

class MyPage extends React.Component {
  render() {

    const usersObservations = this.props.observations.filter(observation => observation.id === this.props.user.id)

    console.log(usersObservations)

    return (
      <div>
        <h1>Käyttäjäsivu</h1>
        <h3>Omat havainnot</h3>
        { usersObservations.map(observation => <Observation key={observation.id} observation={observation} />) }
      </div>
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
  null
)(MyPage)