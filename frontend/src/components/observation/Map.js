import React from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'
import { connect } from 'react-redux'
import { setMarkers, markersForUser, emptyMarkers, addMarker, deleteLast } from '../../reducers/markerReducer'
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
    addressSearch: ''
  }

  componentWillReceiveProps() {
    if (this.props.daLocation && this.props.zoom) {
      this.setState({ mapFocus: this.props.daLocation, mapZoom: this.props.zoom })
    }
  }

  onMarkerClick = (props, marker) => {
    if (!marker.observation.user) {
      return
    }
    this.setState({ activeMarker: marker })
    console.log(this.state.activeMarker)
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

    this.props.addMarker(locationObject)
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
  }

  handleFieldChange = (event) => {
    event.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const style = {
      width: '100%',
      height: '650px'
    }

    const morjes = {
      color: 'black'
    }

    return (
      <div>
        <div id="kartta">
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
              <p>Kommentit: {this.state.activeMarker.observation.additionalComments}</p>
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

export const MapContainerComponent = connect(mapStateToProps, { setMarkers, markersForUser, emptyMarkers, addMarker, deleteLast, setLocation })(GoogleApiWrapper({
  apiKey: 'AIzaSyD8bfLtwWL2sBo1qktwaxChVIomZ10gMpU'
})(MapContainer))