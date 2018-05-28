import React from 'react'
import { connect } from 'react-redux'
import { MapContainerComponent } from '../components/observation/Map'
import { setMarkers, markersForUser, emptyMarkers } from '../reducers/markerReducer'
import { Redirect } from 'react-router-dom'

class MyPage extends React.Component {

  componentWillMount() {
    this.props.setMarkers()
  }

  emptyMap = (event) => {
    event.preventDefault()
    this.props.emptyMarkers()
  }

  getMarkers = (event) => {
    event.preventDefault()
    this.props.setMarkers()
  }

  getUsersMarkers = async (event) => {
    event.preventDefault()
    if (this.props.markers.length < 1) {
      await this.props.setMarkers()
    }
    const markers = this.props.markers.filter(marker => marker.user.id === this.props.user.id)
    this.props.markersForUser(markers)
  }

  render() {

    if (this.props.user.activated) {
      return (
        <div>
          <h1>Käyttäjäsivu</h1>
          <div>
            {this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})
          </div>
          <h3>Omat havainnot</h3>
          <button onClick={this.emptyMap}>tyhjennä kartta</button><button onClick={this.getMarkers}>hae kaikki</button><button onClick={this.getUsersMarkers}>hae omat</button>
          <MapContainerComponent clickable={false} height={'400px'} />
        </div>
      )
    } else {
      return (
        <Redirect to="/" />
      )
    }
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