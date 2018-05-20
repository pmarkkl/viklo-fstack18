import React from 'react'
import { GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react'
import { connect } from 'react-redux'
import { setLocation } from '../reducers/locationReducer'

export class MapContainer extends React.Component {
  state = {
    mapFocus: {
      lat: 60.1699,
      lng: 24.9384
    },
    inputCoordinates: {
      lat: 0,
      lng: 0
    },
    initialCenter: {
      lat: 60.1699,
      lng: 24.9384
    },
    mapZoom: 6,
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
      },
      mapFocus: 666,
      search: '' 
    }
  }

  componentWillMount() {
    this.setState({ observations: this.props.observations })
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

  onMapClick = () => {
    if (this.state.showingInfoWindow) {
      this.setState({ showingInfoWindow: false })
    }
  }

  handleFieldChange = (event) => {
    event.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
    console.log(this.state.search)
  }

  geocodeIt = (event) => {
    event.preventDefault()
    const geocoder = new window.google.maps.Geocoder()

    console.log('ekaksi täällä', this.state.mapFocus)

    geocoder.geocode( { 'address': this.state.search }, (results, status) => {
      if (status === 'OK') {
        console.log('latitude: ', results[0].geometry.viewport.f.b)
        console.log('longitude: ', results[0].geometry.viewport.b.b)
        const mapFocusObject = {
          lat: results[0].geometry.viewport.f.b,
          lng: results[0].geometry.viewport.b.b
        }

        this.setState({ mapFocus: mapFocusObject, mapZoom: 16, inputCoordinates: mapFocusObject, initialCenter: mapFocusObject })

        const locationForReducer = {
          latitude: mapFocusObject.lat,
          longitude: mapFocusObject.lng
        }

        this.props.setLocation(locationForReducer)

        console.log('entäs sit täällä', this.state.mapFocus)

    } else {
        console.log('Ei tuloksia');
      }
    })

  }

  render() {
    const style = {
      width: '750px',
      height: '500px'
    }

    return (
      <div>
        <div>
          <p>etsi osoitteen perusteella: </p>
          <form onSubmit={this.geocodeIt}>
            <input type="text" name="search" onChange={this.handleFieldChange}/><br />
            <button>etsi</button>
            <br />
            latitude: <input type="text" value={this.state.inputCoordinates.lat} /><br />
            longitude: <input type="text" value={this.state.inputCoordinates.lng} />
          </form>
        </div>
        <div id="kartta">
        <Map 
          google={this.props.google} 
          zoom={this.state.mapZoom} 
          style={style}
          center={{ lat: this.state.mapFocus.lat, lng: this.state.mapFocus.lng }}
          initialCenter={{ lat: this.state.initialCenter.lat, lng: this.state.initialCenter.lng }}
          onClick={this.onMapClick}
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
    </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export const MapContainerComponent = connect(mapStateToProps, { setLocation })(GoogleApiWrapper({
  apiKey: process.env.GOOGLE_API
})(MapContainer))