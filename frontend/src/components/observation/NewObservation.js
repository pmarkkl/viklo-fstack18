import React from 'react'
import { connect } from 'react-redux'
import Mask from '../styles/Mask'
import observationService from '../../services/observations'
import { initializeObservations} from '../../reducers/observationReducer'
import { setMarkers, emptyMarkers } from '../../reducers/markerReducer'
import { LocationComponent } from './Location'
import { Link } from 'react-router-dom'

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
      popUpVisibility: false,
      observationSent: false,
      response: {}
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
    console.log('response här', response)
    this.setState({ response })
    if (response.id) {
      this.setState({ observationSent: true })
    }
    console.log(this.state.response)
    this.props.setMarkers()
    this.props.initializeObservations()
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
      width: '454px',
      paddingLeft: '60px'
    }

    const vasen = {
      float: 'left',
      width: '354px'
    }

    if (!this.state.observationSent) {
      return (
        <div>
          <h1>Lisää havainto</h1>
          <div>
          </div>
          <table style={vasen}>
            <tbody>
              <tr style={tr}>
                <td style={tr}>
                  <h4>Laji</h4>
                  Etsi nimen perusteella:<br />
                  <input id="search" type="text" className="lajiSearchInput" name="search" onChange={this.handleChange} value={this.state.search} placeholder="Tylli (Charadrius hiaticula)" />
                  <div className="speciesResults" style={visibility}>
                    {this.state.results.map(species => 
                      <p key={species.id}><a href="" onClick={this.handleSpeciesClick} id={species.id}>{species.finnishName} ({species.latinName}</a>)</p>)
                    }
                  </div>
                </td>
              </tr>
              <tr style={tr}>
                <td style={tr}>
                  <h4>Aika</h4>
                  Päivämäärä<br />
                  <input type="text" name="date" onChange={this.handleDateChange} placeholder="31.12.1900"/><br />
                  Kellonaika<br />
                  <input type="text" name="time" onChange={this.handleChange} placeholder="13.00"/>
                </td>
                <td style={tr}>
                </td>
              </tr>
              <tr style={tr}>
                <td style={tr}>
                  <form onSubmit={this.addObservation}>
                    <h4>Kommentti</h4>
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
    } else {

      const succesfulRequest = () => (
          <div>
            <h1>Havainto lisätty</h1>
            <h4>Lisätty havainto:</h4>
            <p>Laji: {this.state.response.species.finnishName} ({this.state.response.species.latinName})</p>
            <p>Päivämäärä: {this.state.response.date}</p>
            <p>Sijainti: {this.state.response.latitude}, {this.state.response.longitude} ({this.state.response.town})</p>
            <Link to="/uusihavainto">Palaa takaisin</Link>
          </div>
      )

      return (
        <div>
          {this.state.response.id ? succesfulRequest() : ''}
        </div>
      )
    }
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
  { setMarkers, emptyMarkers, initializeObservations }
)(NewObservation)