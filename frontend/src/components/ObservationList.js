import React from 'react'
import { connect } from 'react-redux'
import Observation from './Observation'

const ObservationList = (props) => {
  return (
    <div>
    <h2>Kaikki havainnot</h2>
    {props.observations.map(observation => <Observation key={observation.id} observation={observation} />)}
  </div>
  )
}

const mapStateToProps = (state) => {
  return {
    observations: state.observations
  }
}

export default connect (
  mapStateToProps,
  null
) (ObservationList)