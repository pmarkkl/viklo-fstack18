import React from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'
import { connect } from 'react-redux'
import { addMarker, deleteLast } from '../../reducers/markerReducer'
import { setLocation } from '../../reducers/locationReducer'

export class MapContainer extends React.Component {

  state = {
    showingInfoWindow: false,
    mapFocus: {
      lat: 60.2279004,
      lng: 25.0270719
    },
    initialCenter: {
      lat: 60.2279004,
      lng: 25.0270719
    },
    mapZoom: 7,
    activeMarker: {
      observation: {
        additionalComments: '',
        latitude: '',
        longitude: '',
        date: '',
        comment: '',
        species: {
          finnishName: '',
          latinName: ''
        },
        user: {
          firstname: '',
          lastname: ''
        }
      }
    },
    newMarker: {
      lat: 0,
      lng: 0
    },
    lastMarker: '',
    addressSearch: '',
    marker: { clickable: false }
  }

  componentWillMount() {
    console.log('COMPONENT WILL MOUNT')
    if (this.props.location) {
      this.setState({ initialCenter: { lat: this.props.location.latitude, lng: this.props.location.longitude }})
    }
    if (this.props.zoom) {
      this.setState({ mapZoom: this.props.zoom })
    }
  }

  componentWillReceiveProps() {
    console.log('component will receive props', this.props)
    if (this.props.location) {
      this.setState({ mapFocus: { lat: this.props.location.latitude, lng: this.props.location.longitude } })
    }
    if (this.props.zoom) {
      this.setState({ mapZoom: this.props.zoom })
    }
  }

  onMarkerClick = (props, marker) => {
    if (!marker.observation.user) {
      return
    }
    this.setState({ activeMarker: marker })

    if (props.observation.species) {
      this.setState({
        showingInfoWindow: true,
        activeMarker: marker,
        mapFocus: {
          lat: props.observation.latitude,
          lng: props.observation.longitude
        }
      }) 
    }
  }

  generateIdForRedux = () => {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }

  onMapClick = (mapProps, map, clickEvent, mapCenter) => {
    if (this.state.showingInfoWindow) {
      this.setState({ showingInfoWindow: false })
      return
    }

    if (!this.props.clickable) {
      return
    }

    if (this.props.markers.length > 0) {
      this.props.deleteLast()
    }

    if (this.state.showingInfoWindow) {
      this.setState({ showingInfoWindow: false })
    }

    const lat = clickEvent.latLng.lat()
    const lng = clickEvent.latLng.lng()

    const locationObject = {
      id: this.generateIdForRedux(),
      latitude: lat,
      longitude: lng
    }

    if (this.state.marker.clickable) {
      this.state.marker.setMap(null)
    }

    const marker = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(lat, lng),
      map
    })

    this.setState({ marker })

    this.props.setLocation({ latitude: lat, longitude: lng })

    this.setState({
      lastMarker: locationObject.id,
      mapFocus: { lat, lng }
    })

  }

  testiButtonClick = (event) => {
    event.preventDefault()
    this.setState({ mapFocus: { lat: 64.86901617652283, lng: 28.89430427565719 }})

  }

  onReady = (mapProps, map) => {
    map.disableDoubleClickZoom = true
    map.mapTypeId = 'terrain'
    map.clickable = this.props.clickable
  }

  handleFieldChange = (event) => {
    event.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const style = {
      width: '100%',
      height: this.props.height
    }

    const morjes = {
      color: 'black'
    }

    const karttaStyle = {
      margin: '0px',
      height: this.props.height,
      position: 'relative'
    }

    const sexVisibility = {
      display: this.state.activeMarker.observation.sex === 'undefined' ? 'none' : ''
    }

    const commentVisibility = {
      display: this.state.activeMarker.observation.additionalComments.length > 0 ? '' : 'none'
    }

    return (
      <div>
        <div style={karttaStyle}>
        <Map 
          google={this.props.google} 
          zoom={this.state.mapZoom} 
          style={style}
          center={{ lat: this.state.mapFocus.lat, lng: this.state.mapFocus.lng }}
          initialCenter={{ lat: this.state.initialCenter.lat, lng: this.state.initialCenter.lng }}
          onClick={this.onMapClick}
          onReady={this.onReady}
        >
          { this.props.markers.map(observation => 
            <Marker 
              key={observation.id} 
              position={{lat: observation.latitude, lng: observation.longitude}} 
              onClick={this.onMarkerClick}
              observation={observation}
              style={morjes}
            >
            </Marker>) 
          }
          <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
            <div>
              <p>Laji: {this.state.activeMarker.observation.species.finnishName} ({this.state.activeMarker.observation.species.latinName})</p>
              <p>Havaitsija: {this.state.activeMarker.observation.user.firstname} {this.state.activeMarker.observation.user.lastname}</p>
              <p>Koordinaatit: {this.state.activeMarker.observation.latitude}, {this.state.activeMarker.observation.longitude}</p>
              <p>Päivämäärä: {this.state.activeMarker.observation.date}</p>
              <p style={commentVisibility}>Kommentit: {this.state.activeMarker.observation.additionalComments}</p>
              <p>Lukumäärä: {this.state.activeMarker.observation.number}</p>
              <p style={sexVisibility}>Sukupuoli: {this.state.activeMarker.observation.sex}</p>
            </div>
          </InfoWindow>
        </Map>
        </div>
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    observations: state.observations,
    markers: state.markers,
    user: state.user,
    location: state.location
  }
}

export const MapContainerComponent = connect(mapStateToProps, { addMarker, deleteLast, setLocation })(GoogleApiWrapper({
  apiKey: 'AIzaSyBmAVBitGI5BRkZbosJaj2KX6dD6LdW2Z0', language: 'fi', mapTypeId: 'terrain'
})(MapContainer))