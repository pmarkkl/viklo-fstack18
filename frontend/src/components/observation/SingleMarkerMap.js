import React from 'react'
import { connect } from 'react-redux'
import { setSingleMarker } from '../../reducers/markerReducer'
import { MapContainerComponent } from '../observation/Map'
import { Link } from 'react-router-dom'

const SingleMarkerMap = (props) => {

  const link = "/havainnot"

  props.setSingleMarker(props.id)

  return (
    <div>
      <Link to={link}><img src={require('../../icons/baseline_arrow_left_alt_bla.png')} alt="takaisin"/></Link>
      <div>{ props.observations.length > 0 ? <MapContainerComponent zoom={14} clickable={false} height={'650px'} location={ { latitude: 0, longitude: 0 } }/> : '' }</div>
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
  { setSingleMarker }
) (SingleMarkerMap)