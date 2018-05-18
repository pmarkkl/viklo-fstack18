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
    }
  }

  addObservation = async (event) => {
    event.preventDefault()
    const requestObject = {
      token: this.props.user.token,
      user: this.props.user.id,
      species: this.state.species
    }
    const response = await observationService.newObservation(requestObject)
    this.props.observationCreation(response)
    console.log(response)
  }

  handleChange = (event) => {
    this.setState({ species: event.target.value })
    console.log(this.state.species)
  }

  render() {

    const location = this.props.location
    console.log(location)

    return (
      <div>
        <h2>Lisää havainto</h2>
        <Location />
        {this.locationIndicator}
        <div>
          <form onSubmit={this.addObservation}>
            <select name="species" onChange={this.handleChange}>
              {this.props.species.map(species => <option key={species.id} value={species.id}>{species.finnishName} ({species.latinName})</option>)}
            </select><br />
            <button>lisää</button><br />
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