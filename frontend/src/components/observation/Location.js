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
      zoom: 10,
      search: '',
      result: '',
      mapVisibility: false,
      markers: true,
      location: {
        latitude: 0,
        longitude: 0
      }
    }
  }
  
  componentWillMount() {
    this.props.setMarkers()
  }

  componentWillReceiveProps() {
    this.setState({ 
      location: { latitude: this.props.location.latitude, longitude: this.props.location.longitude }
    })
  }

  error = (error) => {
    console.warn(error.message)
  }

  reverseGeoCode = () => {
    const geocoder = new window.google.maps.Geocoder()
    
    const latlng = {
      lat: this.props.location.latitude,
      lng: this.props.location.longitude
    }

    geocoder.geocode({ 'location': latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.setState({ result: results[0].formatted_address.replace('Unnamed Road,', '') })

          // zip and town

          const split = results[0].formatted_address.split(",")
          const splitSplit = split[split.length-2].trim().split(' ')

          // stateen zip und town

          const forState = {
            latitude: latlng.lat,
            longitude: latlng.lng,
            zipcode: splitSplit[0],
            town: splitSplit[1]
          }

          this.props.setLocation(forState)

        }
      } else {
        this.setState({ result: 'Ei osoitetietoja.' })
      }
    })
  }

  getLocation = (event) => {
    navigator.geolocation.getCurrentPosition(this.success, this.error, options)
  }

  geoCodeAddress = (event) => {
    event.preventDefault()
    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode( { 'address': this.state.search }, (results, status) => {
      if (status === 'OK') {
        const mapFocusObject = {
          lat: results[0].geometry.viewport.f.b,
          lng: results[0].geometry.viewport.b.b
        }

        this.setState({ 
          result: results[0].formatted_address.replace('Finland', 'Suomi'), 
          focus: mapFocusObject, 
          zoom: 14
        })

        const locationObjectWithid = {
          id: this.generateIdForRedux(),
          latitude: mapFocusObject.lat,
          longitude: mapFocusObject.lng
        }

        this.props.setLocation(locationObjectWithid)

        if (this.props.markers.length > 0) {
          this.props.deleteLast()
        }

        this.props.addMarker(locationObjectWithid)
        this.setState({ mapVisibility: true, location: { latitude: locationObjectWithid.latitude, longitude: locationObjectWithid.longitude } })

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

    this.setState({ location: { latitude: coordinates.latitude, longitude: coordinates.longitude }})

    const locationForReducer = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude
    }

    this.setState({ location: { latitude: coordinates.latitude, longitude: coordinates.longitude } })
    this.props.setLocation(locationForReducer)
    this.reverseGeoCode()
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  toggleVisibility = (event) => {
    event.preventDefault()
    this.setState({ mapVisibility: false, search: '' })
    this.reverseGeoCode()
  }

  openMap = (event) => {
    event.preventDefault()
    this.setState({ mapVisibility: true })
  }

  toggleMarkers = (event) => {
    event.preventDefault()
    this.setState({ markers: !this.state.markers })
  }

  emptyMap = (event) => {
    event.preventDefault()
    this.props.emptyMarkers()
  }

  popUpProps = () => (
    <div>
      <a href="/"><img src={require('../../icons/baseline_close_white_18dp.png')} alt="Sulje" onClick={this.toggleVisibility} /></a>&nbsp;
      <a href="/"><img src={require('../../icons/baseline_location_off_white_18dp.png')} alt="Tyhjennä kartta" onClick={this.emptyMap} /></a>
      <MapContainerComponent zoom={this.state.zoom} />
    </div>
  )

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
      height: '678px',
      backgroundColor: '#414045',
      padding: '2px',
      transform: 'translate(-50%, -50%)',
      fontSize: '6pt',
      zIndex: '3',
      border: '1px solid #414045',
      borderRadius: '5px',
    }

    const testi = {
      display: this.state.mapVisibility ? '' : 'none',
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      position: 'absolute',
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: '2'
    }

    const buttonStyle = {
      backgroundColor: 'white',
      color: 'blue',
      margin: '0px',
      fontSize: '8pt'
    }

    const resultsStyle = {
      display: this.state.result.length < 1 ? 'none' : '',
      backgroundColor: '#f7f7f7',
      width: '400px',
      fontSize: '11pt',
      padding: '10px',
      border: '1px solid #DDDDDD',
      boxShadow: '3px 3px 3px #fbfbfb'
    }

    return (
      <div>
        <h3>Sijainti</h3>
        <p>Merkitse sijainti kartalle</p>
        <a href="/"><img src={require('../../icons/baseline_map_black_18dp.png')} alt="Avaa kartta" onClick={this.openMap} /></a>
        <form onSubmit={this.geoCodeAddress}>
          <input type="text" name="search" value={this.state.search} onChange={this.handleFieldChange} placeholder="Pasteurinkatu 1, Helsinki"/>
          <button>Etsi</button>
        </form>
        <p>Sijainti käyttämäsi laitteen perusteella</p>
        <p><button onClick={this.getLocation}>Hae laitteesi sijainti</button></p>
        <div style={resultsStyle}>
          <p>{this.state.result}</p>
          <p>Lat: {this.props.location.latitude}</p>
          <p>Lng: {this.props.location.longitude}</p>
        </div>
        <div style={testi} onClick={this.toggleVisibility}>
        </div>
        <div style={popUpTesti}>
          <a href="/"><img src={require('../../icons/baseline_close_white_18dp.png')} alt="Sulje" onClick={this.toggleVisibility} /></a>&nbsp;
          <a href="/"><img src={require('../../icons/baseline_location_off_white_18dp.png')} alt="Tyhjennä kartta" onClick={this.emptyMap} /></a>
          <MapContainerComponent zoom={this.state.zoom} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    observations: state.observations,
    location: state.location,
    markers: state.markers
  }
}

export const LocationComponent = connect(mapStateToProps, { setLocation, addMarker, deleteLast, setMarkers, emptyMarkers })(GoogleApiWrapper({
  apiKey: asdasdsa, language: 'fi'
})(Location))