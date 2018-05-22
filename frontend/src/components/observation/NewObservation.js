import React from 'react'
import { connect } from 'react-redux'
import observationService from '../../services/observations'
import { observationCreation } from '../../reducers/observationReducer'
import { MapContainerComponent } from '../../components/observation/Map'
import Location from './Location'

class NewObservation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      species: [],
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      search: '',
      resultsVisibility: false,
      result: '',
      speciesId: ''
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
    this.setState({ [event.target.name]: event.target.value })
    const species = this.props.species.filter(species => species.finnishName.toLowerCase().includes(this.state.search.toLowerCase()))
    this.setState({ species })
    if (species.length === 1) {
        this.setState({ 
          resultsVisibility: true,
          result: `${species[0].finnishName} (${species[0].latinName})`,
          speciesId: species[0].id
        })
    } else {
      this.setState({
        resultsVisibility: false
      })
    }
  }

  divOnClick = (event) => {
    event.preventDefault()
    this.setState({ 
      search: `${this.state.species[0].finnishName} (${this.state.species[0].latinName})`,
      resultsVisibility: false
     })
  }

  render() {

    const visibility = {
      display: this.state.resultsVisibility ? '' : 'none'
    }

    return (
      <div>
        <h1>Havainnot</h1>
        <MapContainerComponent />
        <MapContainerComponent />
        <MapContainerComponent />
        <MapContainerComponent />
        <div>
          <form onSubmit={this.addObservation}>
            <div id="laji">
              <h3>Laji</h3>
              <h4>Etsi nimen perusteella</h4>
              <input id="search" type="text" name="search" onChange={this.handleChange} value={this.state.search}/>
              <div id="results" style={visibility} onClick={this.divOnClick}>
                  <a href="">{this.state.result}</a>
              </div>
            </div>
          </form>
        </div>
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