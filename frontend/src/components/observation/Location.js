import React from 'react'
import { connect } from 'react-redux'
import { setLocation } from '../../reducers/locationReducer'

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

class Location extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      latitude: '',
      longitude: ''
    }
  }
  
  error = (error) => {
    console.warn(error.message)
  }
  
  getLocation = (event) => {
    navigator.geolocation.getCurrentPosition(this.success, this.error, options)
  }

  success = (position) => {
    const coordinates = position.coords
    this.setState({ latitude: coordinates.latitude, longitude: coordinates.longitude })
    const locationForReducer = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }
    this.props.setLocation(locationForReducer)
  }

  render() {
    return (
      <div>
      <button onClick={this.getLocation}>Hae sijainti</button>
      <label type="submit" onClick={this.getLocation} value="Hae sijainti" />
      </div>
    )
  }
}

export default connect (
  null,
  { setLocation }
) (Location)