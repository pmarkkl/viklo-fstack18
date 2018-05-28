import React from 'react'
import { connect } from 'react-redux'
import Mask from '../styles/Mask'
import observationService from '../../services/observations'
import { observationCreation } from '../../reducers/observationReducer'
import { setMarkers, emptyMarkers } from '../../reducers/markerReducer'
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
      active: {},
      additionalComments: '',
      popUpVisibility: false
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
      zipcode: this.props.location.zipcode,
      town: this.props.location.town,
      additionalComments: this.state.additionalComments,
      date: new Date(this.state.date + ' ' + this.state.time.replace('.', ':'))
    }
    this.setState({ latitude: '', longitude: '' })
    const response = await observationService.newObservation(requestObject)
    console.log(response)
    this.props.setMarkers()
  }

  handleChange = (event) => {
    console.log(this.state)
    this.setState({ [event.target.name]: event.target.value })
    const species = this.props.species
    const search = event.target.value
    if (event.target.name === 'search') {
      const speciesFilter = species.filter(species => species.finnishName.toLowerCase().includes(search.toLowerCase()))
      if (speciesFilter.length < 21) {
          this.setState({
            results: speciesFilter,
            resultsVisibility: true
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
    const search = `${laji.finnishName} (${laji.latinName})`
    this.setState({ 
      resultsVisibility: false,
      active: laji,
      search,
      speciesId: laji.id
     })
  }

  toggleVisibility = (event) => {
    event.preventDefault()
    this.setState({ popUpVisibility: !this.state.popUpVisibility })
    console.log(this.state)
  }

  render() {
    const visibility = {
      display: this.state.resultsVisibility ? '' : 'none'
    }

    const tr = {
      verticalAlign: 'top'
    }

    const oikea = {
      display: 'inline-block',
      width: '458px',
      paddingLeft: '60px'
    }

    const vasen = {
      float: 'left',
      width: '438px',
      borderRight: '1px solid #DDDDDD'
    }
    return (
      <div>
        <h1>Lisää havainto</h1>
        <div>
        </div>
        <table style={vasen}>
          <tbody>
            <tr style={tr}>
              <td style={tr}>
                <h3>Laji</h3>
                <p>Etsi nimen perusteella</p>
                <input id="search" type="text" className="lajiSearchInput" name="search" onChange={this.handleChange} value={this.state.search} placeholder="Tylli (Charadrius hiaticula)" />
                <div id="results" style={visibility}>
                  {this.state.results.map(species => 
                    <p key={species.id}><a href="" onClick={this.handleSpeciesClick} id={species.id}>{species.finnishName} ({species.latinName}</a>)</p>)
                  }
                </div>
              </td>
            </tr>
            <tr style={tr}>
              <td style={tr}>
              <h3>Aika</h3>
                <p>Päivämäärä</p>
                <input type="text" name="date" onChange={this.handleDateChange} placeholder="31.12.1900"/>
                <p>Kellonaika</p>
                <input type="text" name="time" onChange={this.handleChange} placeholder="13.00"/>
              </td>
              <td style={tr}>
              </td>
            </tr>
            <tr style={tr}>
              <td style={tr}>
                <form onSubmit={this.addObservation}>
                  <h3>Kommentti:</h3>
                  <textarea name="additionalComments" placeholder="Poikanen" onChange={this.handleChange} /><br />
                  <button>Lisää havainto</button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
        <table style={oikea}>
          <tbody>
            <tr style={tr}>
              <td style={tr}>
              <LocationComponent />
              </td>
            </tr>
            <tr style={tr}>
              <td>
              </td>
            </tr>
          </tbody>
        </table>
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
  { observationCreation, setMarkers, emptyMarkers }
)(NewObservation)