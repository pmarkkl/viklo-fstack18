import React from 'react'
import { connect } from 'react-redux'
import { setLocation } from '../../reducers/locationReducer'
import { GoogleApiWrapper } from 'google-maps-react'
import { MapContainerComponent } from './Map'
import { addMarker, deleteLast } from '../../reducers/markerReducer'

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

class Location extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      focus: {
        lat: 60.2279004,
        lng: 25.0270719
      },
      search: '',
      result: '',
      mapVisibility: false,
    }
  }
  
  error = (error) => {
    console.warn(error.message)
  }
  
  getLocation = (event) => {
    navigator.geolocation.getCurrentPosition(this.success, this.error, options)
  }

  geoCodeAddress = (event) => {
    event.preventDefault()
    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode( { 'address': this.state.search }, (results, status) => {
      if (status === 'OK') {

        console.log('latitude: ', results[0].geometry.viewport.f.b)
        console.log('longitude: ', results[0].geometry.viewport.b.b)

        const mapFocusObject = {
          lat: results[0].geometry.viewport.f.b,
          lng: results[0].geometry.viewport.b.b
        }

        this.setState({ result: results[0].formatted_address.replace('Finland', 'Suomi'), focus: mapFocusObject })

        const locationForReducer = {
          latitude: mapFocusObject.lat,
          longitude: mapFocusObject.lng
        }
        
        const locationObjectWithid = {
          id: this.generateIdForRedux(),
          latitude: mapFocusObject.lat,
          longitude: mapFocusObject.lng
        }

        this.props.setLocation(locationForReducer)
        this.props.deleteLast()
        this.props.addMarker(locationObjectWithid)

    } else {
        console.log('Ei tuloksia');
      }
    })

  }

  generateIdForRedux = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
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

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }


  render() {

    console.log('ny renderöidään LOCATIOn')

    const mapVisibility = {
      display: this.state.mapVisibility ? 'none' : ''
    }

    return (
      <div>
      <button onClick={this.getLocation}>Hae laitteesi sijainti</button>
      <p>Syötä osoite:</p>
      <form onSubmit={this.geoCodeAddress}>
        <input type="text" name="search" onChange={this.handleFieldChange} />
        <button>Etsi</button>
      </form>
      <p>{this.state.result}</p>
      <div style={mapVisibility}>
        <MapContainerComponent daLocation={this.state.focus} />
      </div>
      </div>
    )
  }
}

export const LocationComponent = connect(null, { setLocation, addMarker, deleteLast })(GoogleApiWrapper({
  apiKey: 'AIzaSyD8bfLtwWL2sBo1qktwaxChVIomZ10gMpU'
})(Location))