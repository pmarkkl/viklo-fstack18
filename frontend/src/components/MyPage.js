import React from 'react'
import { connect } from 'react-redux'
import { MapContainerComponent } from '../components/observation/Map'
import { setMarkers, markersForUser, emptyMarkers } from '../reducers/markerReducer'
import { Redirect } from 'react-router-dom'
import userService from '../services/users'

class MyPage extends React.Component {

  state = {
    currentPassword: '',
    newPassword: '',
    passwordConfirmation: '',
    address: '',
    zipcode: '',
    town: '',
    phone: '',
    messages: [],
    messageVisibility: false
  }

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

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleContactsSubmit = async (event) => {
    event.preventDefault()
    const requestObject = {
      token: this.props.user.token,
      address: this.state.address,
      town: this.state.town,
      zipcode: this.state.zipcode,
      phone: this.state.phone
    }
    const response = await userService.setContacts(requestObject)
    this.setState({ address: '', zipcode: '', town: '' })
    if (response.error) {
      this.setState({ messages: response.error, messageVisibility: true })
    } else {
      this.setState({ messages: ['Yhteystiedot päivitetty'], messageVisibility: true })
    }
    setTimeout(() => this.setState({ messageVisibility: false }), 7500)
  }

  render() {

    const divStyle = {
      backgroundColor: '#373737',
      marginBottom: '10px'
    }

    const margin = {
      marginBottom: '20px'
    }

    const contactsDiv = {
      backgroundColor: '#f3f3f3',
      width: '100%',
      marginTop: '10px',
      padding: '10px'
    }

    const messageDiv = {
      display: this.state.messageVisibility ? '' : 'none',
      width: '100%',
      minHeight: '30px',
      color: 'red',
      backgroundColor: '#f3f3f3'
    }

    if (this.props.user.activated) {
      return (
        <div>
          <h1>Käyttäjäsivu</h1>
          <div style={margin}>
            {this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})
          </div>
          <div className="observationList" style={divStyle}>
            <ul>
              <li><a href="/">Käyttäjätiedot</a></li>
            </ul>
          </div>
          <div style={messageDiv}>
            { this.state.messages.map(error => <p key={error}>{error}</p>) }
          </div>
          <table className="myPageTable">
            <tbody>
              <tr>
                <td>
                  <form>
                  Päivitä salasana<br />
                  <input type="password" name="currentPassword" value={this.state.newPassword} onChange={this.handleFieldChange} placeholder="Nykyinen salasana"/><br />
                  <input type="password" name="newPassword" value={this.state.newPassword} onChange={this.handleFieldChange} placeholder="Uusi salasana"/><br />
                  <input type="password" name="newConfirmation" value={this.state.newPassword} onChange={this.handleFieldChange} placeholder="Uusi salasana uudestaan"/><br />
                  <button>Lähetä</button>
                  </form>
                </td>
                <td>
                  Päivitä tiedot<br />
                  <form onSubmit={this.handleContactsSubmit}>
                    <input type="text" name="address" value={this.state.address} onChange={this.handleFieldChange} placeholder="Katuosoite"/><br />
                    <input type="text" name="zipcode" value={this.state.zipcode} onChange={this.handleFieldChange} placeholder="Postinumero"/><br />
                    <input type="text" name="town" value={this.state.town} onChange={this.handleFieldChange} placeholder="Kunta"/><br />
                    <input type="text" name="phone" value={this.state.phone} onChange={this.handleFieldChange} placeholder="Puhelinnumero" /><br />
                    <button>Lähetä</button>
                  </form>
                </td>
                {/* tämä pitää muistaa korjata */}
                <td>
                  Nykyiset tietosi
                  <div style={contactsDiv}>
                  Osoite:<br />
                  {this.props.user.address} {this.props.user.zipcode} {this.props.user.town}<br />
                  Puhelin:<br />
                  {this.props.user.phone}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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