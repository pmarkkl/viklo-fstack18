import React from 'react'
import { connect } from 'react-redux'
import Observation from './Observation'

const ObservationList = (props) => {

  const ekaDate = new Date('Mon May 21 2018 02:47:14 GMT+0300 (Suomen kesäaika)')
  const tokaDate = new Date('Sun May 20 2018 20:25:43 GMT+0300 (Suomen kesäaika)')

  console.log(ekaDate.getMonth())

  console.log(ekaDate < tokaDate)

  console.log(ekaDate)

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