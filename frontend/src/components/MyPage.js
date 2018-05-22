import React from 'react'
import { connect } from 'react-redux'
import { MapContainerComponent } from '../components/observation/Map'
import { setMarkers, markersForUser, emptyMarkers, addMarker } from '../reducers/markerReducer'

class MyPage extends React.Component {

  emptyMap = (event) => {
    event.preventDefault()
    this.props.emptyMarkers()
  }

  getMarkers = (event) => {
    event.preventDefault()
    this.props.setMarkers()
  }

  getUsersMarkers = (event) => {
    event.preventDefault()
    const markers = this.props.observations.filter(marker => marker.user.id === this.props.user.id)
    this.props.markersForUser(markers)
  }

  render() {
    return (
      <div>
        <h1>Käyttäjäsivu</h1>
        <h3></h3>
        <div>
          {this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})
        </div>
        <h3>Omat havainnot</h3>
        <button onClick={this.emptyMap}>tyhjennä kartta</button><button onClick={this.getMarkers}>hae kaikki</button><button onClick={this.getUsersMarkers}>hae omat</button>
        <MapContainerComponent />
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

export default connect(
  mapStateToProps,
  { setMarkers, markersForUser, emptyMarkers }
)(MyPage)