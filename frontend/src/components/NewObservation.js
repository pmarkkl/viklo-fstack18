import React from 'react'
import { connect } from 'react-redux'
import observationService from '../services/observations'
import { observationCreation } from '../reducers/observationReducer'
import Location from '../components/Location'

class NewObservation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      species: '',
      latitude: this.props.latitude,
      longitude: this.props.longitude
    }
  }


  addObservation = async (event) => {
    event.preventDefault()

    const requestObject = {
      token: this.props.user.token,
      user: this.props.user.id,
      species: this.state.species,
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude
    }


    this.setState({ latitude: '', longitude: '' })
    const response = await observationService.newObservation(requestObject)
    this.props.observationCreation(response)
    console.log(response)
  }

  handleChange = (event) => {
    this.setState({ species: event.target.value })
  }

  render() {
    return (
      <div>
        <h2>Lisää havainto</h2>
        <Location />
        <div>
          <form onSubmit={this.addObservation}>
            <select name="species" onChange={this.handleChange}>
              {this.props.species.map(species => <option key={species.id} value={species.id}>{species.finnishName} ({species.latinName})</option>)}
            </select><br />
            Latitude: <input type="text" name="latitude" defaultValue={this.state.latitude} value={this.props.location.latitude}/><br />
            Longitude: <input type="text" name="longitude" defaultValue={this.state.longitude} value={this.props.location.longitude}/><br />
            <input type="submit" value="Lisää" /><br />
          </form>
        </div>
        <br />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    species: state.species,
    user: state.user,
    location: state.location
  }
}

export default connect(
  mapStateToProps,
  { observationCreation }
)(NewObservation)