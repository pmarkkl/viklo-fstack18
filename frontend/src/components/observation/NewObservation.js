import React from 'react'
import { connect } from 'react-redux'
import observationService from '../../services/observations'
import { observationCreation } from '../../reducers/observationReducer'
import { LocationComponent } from './Location'

class NewObservation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      species: [],
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      search: '',
      resultsVisibility: false,
      results: [],
      speciesId: '',
      date: '',
      time: '',
      active: {}
    }
  }


  addObservation = async (event) => {
    event.preventDefault()
    const requestObject = {
      token: this.props.user.token,
      user: this.props.user.id,
      species: this.state.speciesId,
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
      date: new Date(this.state.date + ' ' + this.state.time.replace('.', ':'))
    }
    this.setState({ latitude: '', longitude: '' })
    const response = await observationService.newObservation(requestObject)
    this.props.observationCreation(response)
    console.log(response)
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
    if (event.target.name === 'search') {
      const species = this.props.species.filter(species => species.finnishName.toLowerCase().includes(this.state.search.toLowerCase()))
      this.setState({ species })
      if (species.length < 20) {
          this.setState({
            resultsVisibility: true,
            results: species
          })
      } else {
        this.setState({
          resultsVisibility: false
        })
      }
    }
  }

  handleDateChange = (event) => {
    const split = event.target.value.split('.')
    if (split.length === 3) {
      const date = split[1] + ' ' + split[0] + ' ' + split[2]
      this.setState({ date })
    }
  }

  handleSpeciesClick = (event) => {
    event.preventDefault()
    const laji = this.props.species.find(species => species.id === event.target.id)
    console.log(laji)
    const search = laji.finnishName + ' (' + laji.latinName + ')'
    this.setState({ 
      resultsVisibility: false, 
      results: [], 
      active: laji,
      search,
      speciesId: laji.id
     })
  }

  render() {
    const date = new Date(this.state.date + ' ' + this.state.time.replace('.', ':'))
    console.log(date)

    const visibility = {
      display: this.state.resultsVisibility ? '' : 'none'
    }

    return (
      <div>
        <h1>Uusi havainto</h1>
        <div>
          <form onSubmit={this.addObservation}>
              <h3>Laji</h3>
              <p>Etsi nimen perusteella</p>
              <input id="search" type="text" name="search" onChange={this.handleChange} value={this.state.search} placeholder="Tylli" />
              <div id="results" style={visibility}>
                {this.state.results.map(species => 
                  <p key={species.id}><a href="" onClick={this.handleSpeciesClick} id={species.id}>{species.finnishName} ({species.latinName}</a>)</p>)
                }
              </div>
              <h3>Aika</h3>
              <p>Päivämäärä</p>
              <input type="text" name="date" onChange={this.handleDateChange} placeholder="31.12.1900"/>
              <p>Kellonaika</p>
              <input type="text" name="time" onChange={this.handleChange} placeholder="13.00"/>
              <h3>Sijainti</h3>
          <button>Lähetä</button>
          </form>
          <LocationComponent />
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