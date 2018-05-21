import React from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'
import { connect } from 'react-redux'
import { setMarkers, markersForUser, emptyMarkers, addMarker } from '../../reducers/markerReducer'

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
    mapZoom: 6,
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
    }
  }

  onMarkerClick = (props, marker) => {
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
      }
    })
  }

  render() {

    const style = {
      width: '800px',
      height: '400px'
    }

    return (
      <div>
        <div id="kartta">
        <Map 
          google={this.props.google} 
          zoom={this.state.mapZoom} 
          style={style}
          center={{ lat: this.state.initialCenter.lat, lng: this.state.initialCenter.lng }}
          initialCenter={{ lat: this.state.initialCenter.lat, lng: this.state.initialCenter.lng }}
          onClick={this.onMapClick}
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
    user: state.user
  }
}

export const MapContainerComponent = connect(mapStateToProps, { setMarkers, markersForUser, emptyMarkers, addMarker })(GoogleApiWrapper({
  apiKey: process.env.GOOGLE_API
})(MapContainer))