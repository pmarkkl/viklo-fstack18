import React from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    observations: [],
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

  componentWillMount() {
    this.setState({ observations: this.props.observations })
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({ 
      showingInfoWindow: true,
      activeMarker: marker,
      selectedPlace: props,
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
    console.log(this.state.activeMarkerInfo)
  }

  render() {
    const style = {
      width: '750px',
      height: '450px'
    }
    
    return (
      <div>
        <Map 
          google={this.props.google} 
          zoom={6} 
          style={style}
          initialCenter={{ lat: 65.01236, lng: 25.46816 }}
        >

          { this.props.observations.map(observation => 
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
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.GOOGLE_API
})(MapContainer)