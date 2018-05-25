import React from 'react'
import { connect } from 'react-redux'
import { setLocation } from '../../reducers/locationReducer'
import { GoogleApiWrapper } from 'google-maps-react'
import { MapContainerComponent } from './Map'
import { addMarker, deleteLast, emptyMarkers, setMarkers } from '../../reducers/markerReducer'

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
      zoom: 8,
      search: '',
      result: '',
      mapVisibility: false,
      markers: true,
      location: {
        lat: 0,
        lng: 0
      }
    }
  }
  
  componentWillMount() {
    this.props.setMarkers()
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

        this.setState({ result: results[0].formatted_address.replace('Finland', 'Suomi'), focus: mapFocusObject, zoom: 14 })

        const locationForReducer = {
          latitude: mapFocusObject.lat,
          longitude: mapFocusObject.lng
        }
        
        const locationObjectWithid = {
          id: this.generateIdForRedux(),
          latitude: mapFocusObject.lat,
          longitude: mapFocusObject.lng
        }

        this.props.setLocation(locationObjectWithid)
        this.props.deleteLast()
        this.props.addMarker(locationObjectWithid)
        this.setState({ mapVisibility: true, location: { lat: locationObjectWithid.latitude, lng: locationObjectWithid.longitude } })

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

  toggleVisibility = (event) => {
    event.preventDefault()
    this.setState({ mapVisibility: false, search: '' })
  }

  toggleMarkers = (event) => {
    event.preventDefault()
    this.setState({ markers: !this.state.markers })
  }

  render() {
    const mapVisibility = {
      display: this.state.mapVisibility ? '' : 'none'
    }

    const popUpTesti = {
      display: this.state.mapVisibility ? '' : 'none',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginRight: '-50%',
      width: '1050px',
      height: '650px',
      backgroundColor: '#383e41',
      padding: '2px',
      transform: 'translate(-50%, -50%)',
      fontSize: '6pt'
    }

    const testi = {
      display: this.state.mapVisibility ? '' : 'none',
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.7)'
    }

    const buttonStyle = {
      backgroundColor: 'white',
      color: 'blue',
      margin: '0px',
      fontSize: '8pt'
    }

    return (
      <div>
      <button onClick={this.getLocation}>Hae laitteesi sijainti</button>
      <p>Syötä osoite:</p>
      <form onSubmit={this.geoCodeAddress}>
        <input type="text" name="search" value={this.state.search} onChange={this.handleFieldChange} placeholder="Pasteurinkatu 1, Helsinki"/>
        <button>Etsi</button>
      </form>
      <form>
        <p>Koordinaatit</p>
        <input type="text" name="lat" value={this.state.location.lat} readOnly/>
        <input type="text" name="lng" value={this.state.location.lng} readOnly/>
      </form>
      <div style={testi}>
      </div>
      <div style={popUpTesti}>
        <img src={require('../../x.png')} alt="Sulje" onClick={this.toggleVisibility} />&nbsp;
        <img src={require('../../marker.png')} alt="Sulje" onClick={this.toggleVisibility} />
        <MapContainerComponent daLocation={this.state.focus} zoom={this.state.zoom}/>
      </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    observations: state.observations,
    location: state.location
  }
}

export const LocationComponent = connect(mapStateToProps, { setLocation, addMarker, deleteLast, setMarkers })(GoogleApiWrapper({
  apiKey: asdasdsads
})(Location))