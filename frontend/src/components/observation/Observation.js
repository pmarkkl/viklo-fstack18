import React from 'react'
import { Link } from 'react-router-dom'
import { setLocation } from '../../reducers/locationReducer'
import { connect } from 'react-redux'

const observationStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '3px',
  backgroundColor: '#f3f3f3',
  boxSizing: 'border-box',
  fontSize: '10pt',
  position: 'relative',
  zIndex: 1,
  fontFamily: `'Noto Sans', sans-serif`
}

const Observation = (props) => {
  const observation = props.observation
  return (
    <div style={observationStyle}>
      <div>
        Laji: {observation.species.finnishName} ({observation.species.latinName})<br />
        Lisännyt: {observation.user.firstname} {observation.user.lastname}<br />
        Ajankohta: {observation.date}<br />
        Sijainti: {observation.latitude}, {observation.longitude} ({observation.town})<br />
        <Link to={`/havainnot/${observation.id}`} params={observation.id} onClick={() => props.setLocation({ latitude: observation.latitude, longitude: observation.longitude})}>Näytä kartalla</Link>
      </div>
    </div>
  )
}

export default connect (
  null,
  { setLocation }
)(Observation)