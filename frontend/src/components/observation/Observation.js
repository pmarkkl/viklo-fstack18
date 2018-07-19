import React from 'react'
import observationService from '../../services/observations'
import { Link } from 'react-router-dom'
import { setLocation } from '../../reducers/locationReducer'
import { connect } from 'react-redux'


class Observation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      observation: this.props.observation
    }
  }

  handleLike = async (event) => {
    event.preventDefault()

    const likeObject = {
      user: this.props.user,
      observation: this.state.observation.id
    }

    const response = await observationService.like(likeObject)

  }

  render() {

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

    const likeVisibility = {
      display: this.props.user.token ? '' : 'none'
    }

    const observation = this.props.observation

    return (
      <div style={observationStyle}>
      <div>
        Laji: {observation.species.finnishName} ({observation.species.latinName})<br />
        Lisännyt: {observation.user.firstname} {observation.user.lastname}<br />
        Ajankohta: {observation.date}<br />
        Sijainti: {observation.latitude}, {observation.longitude} ({observation.town})<br />
        <Link to={`/havainnot/${observation.id}`} params={observation.id} onClick={() => this.props.setLocation({ latitude: observation.latitude, longitude: observation.longitude})}>Näytä kartalla</Link>
        <br />
        <button style={likeVisibility} onClick={this.handleLike}>Like</button>
      </div>
    </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect (
  mapStateToProps,
  { setLocation }
)(Observation)