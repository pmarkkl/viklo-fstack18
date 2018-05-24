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
    activeMarker: {},
    activeMarkerInfo: {
      firstname: '',
      lastname: '',
      latitude: '',
      longitude: '',
      date: undefined,
      comment: '',
      species: {
        finnishName: '',
        latinName: ''
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
    this.setState({ mapFocus: this.props.daLocation })
  }

  onMarkerClick = (props, marker) => {
    if (props.observation.species) {
      this.setState({
        showingInfoWindow: true,
        activeMarker: marker,
        activeMarkerInfo: {
          firstname: props.observation.user.firstname,
          lastname: props.observation.user.lastname,
          latitude: props.observation.latitude,
          longitude: props.observation.longitude,
          date: props.observation.date,
          comment: props.observation.additionalComments,
          species: {
            finnishName: props.observation.species.finnishName,
            latinName: props.observation.species.latinName
          }
        },
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

    this.props.deleteLast()

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
    console.log(this.state.search)
  }

  render() {
    const style = {
      width: '100%',
      height: '400px'
    }

    return (
      <div>
        <div id="kartta">
        <button onClick={this.testiButtonClick}>click</button>
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
            >
            </Marker>) 
          }
          <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
            <div>
              <p><b>{this.state.activeMarkerInfo.species.finnishName} ({this.state.activeMarkerInfo.species.latinName})</b></p>
              <p>Havaitsija: {this.state.activeMarkerInfo.firstname} {this.state.activeMarkerInfo.lastname}</p>
              <p>Tarkempi sijainti: {this.state.activeMarkerInfo.latitude}, {this.state.activeMarkerInfo.longitude}</p>
              <p>Päivämäärä: {this.state.activeMarkerInfo.date}</p>
              <p>Kommentit: <br /> {this.state.activeMarkerInfo.comment}</p>
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
  apiKey: '3213213kl'
})(MapContainer))