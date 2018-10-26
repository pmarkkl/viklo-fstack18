import React from 'react'
import { connect } from 'react-redux'
import { setMarkers, markersForUser, emptyMarkers } from '../reducers/markerReducer'
import { initNotification, clearNotification } from '../reducers/userNotificationReducer'
import { initializeUser } from '../reducers/userReducer'
import { Redirect } from 'react-router-dom'
import userService from '../services/users'
import { Link } from 'react-router-dom'
import MyPageObservation from './observation/MyPageObservation'

class MyPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentPassword: '',
      newPassword: '',
      passwordConfirmation: '',
      address: '',
      zipcode: '',
      town: '',
      phone: '',
      messages: [],
      messageVisibility: false,
      returnedErrors: false,
      menu: {
        contacts: true,
        observations: false
      },
      timeoutId: '',
      observations: [],
      notification: ''
    }
  }


  componentWillMount() {
    this.props.setMarkers()
  }

  componentWillUnmount() {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId)
    }
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
    this.setState({ address: '', zipcode: '', town: '', phone: '' })
    if (response.error) {
      this.setState({ messages: response.error, messageVisibility: true, returnedErrors: true })
      const id = setTimeout(() => this.setState({ messageVisibility: false, messages: [] }), 7500)
      this.setState({ timeoutId: id })
    } else {
      const id = setTimeout(() => this.setState({ messageVisibility: false, messages: [] }), 7500)
      this.setState({ timeoutId: id })
      const updatedUser = {
        activated: this.props.user.activated,
        token: this.props.user.token,
        admin: this.props.user.admin,
        email: this.props.user.email,
        firstname: this.props.user.firstname,
        lastname: this.props.user.lastname,
        id: this.props.user.id,
        address: response.address,
        zipcode: response.zipcode,
        town: response.town,
        phone: response.phone
      }
      window.localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
      await this.props.initializeUser(updatedUser)
      this.props.initNotification('Käyttäjätiedot päivitetty.')
      setTimeout(() => this.props.clearNotification(), 7500)
    }
  }

  handlePasswordSubmit = async (event) => {
    event.preventDefault()
    const requestObject = {
      token: this.props.user.token,
      currentPassword: this.state.currentPassword,
      newPassword: this.state.newPassword,
      passwordConfirmation: this.state.passwordConfirmation
    }
    const response = await userService.setPassword(requestObject)
    console.log(response)
    if (response.error) {
      this.setState({ messageVisibility: true, messages: response.error, currentPassword: '', newPassword: '', passwordConfirmation: '' })
    } else {
      this.setState({ messageVisibility: true, messages: response.message, currentPassword: '', newPassword: '', passwordConfirmation: '' })
    }
    const id = setTimeout(() => this.setState({ messageVisibility: false, messages: [] }), 7500)
    this.setState({ timeoutId: id })
  }

  handleMenuClick = (event) => {
    event.preventDefault()
    if (event.target.name === 'contacts') {
      this.setState({ menu: { contacts: true, observations: false } })
    } else {
      this.setState({ menu: { contacts: false, observations: true } })
    }
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
      backgroundColor: '#575757',
      color: 'white',
      width: '100%',
      marginTop: '10px',
      padding: '10px',
      fontSize: '12pt'
    }

    const messageDiv = {
      display: this.state.messageVisibility ? '' : 'none',
      minWidth: '300px',
      minHeight: '30px',
      paddingLeft: '10px',
      paddingRight: '10px',
      fontSize: '13pt',
      color: this.state.returnedErrors? 'red' : 'black',
      backgroundColor: '#f3f3f3'
    }

    const contactsActive = {
      backgroundColor: this.state.menu.contacts ? '#365d81' : ''
    }

    const observationsActive = {
      backgroundColor: this.state.menu.observations ? '#365d81' : ''
    }

    const notificationStyle = {
      backgroundColor: '#efefef',
      display: this.props.userNotification.length > 0 ? '' : 'none',
      fontSize: '15pt',
      marginTop: '4px',
      marginBottom: '4px',
      padding: '5px'
    }

    const contacts = () => (
      <div>
        <div style={messageDiv}>
          { this.state.messages.map(error => <p key={error}>{error}</p>) }
        </div>
        <table className="myPageTable">
        <tbody>
          <tr>
            <td>
              <form onSubmit={this.handlePasswordSubmit}>
              Päivitä salasana<br />
              <input type="password" name="currentPassword" value={this.state.currentPassword} onChange={this.handleFieldChange} placeholder="Nykyinen salasana"/><br />
              <input type="password" name="newPassword" value={this.state.newPassword} onChange={this.handleFieldChange} placeholder="Uusi salasana"/><br />
              <input type="password" name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleFieldChange} placeholder="Uusi salasana uudestaan"/><br />
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
            <td>
              Nykyiset tietosi
              <div style={contactsDiv}>
              Osoite:<br />
              {this.props.user.address} {this.props.user.zipcode} {this.props.user.town}<br />
              </div>
              <div style={contactsDiv}>
              Puhelin:<br />
              {this.props.user.phone}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    )


    const observations = () => (
      <div>
        { this.props.observations.filter(observation => observation.user.id === this.props.user.id).map(observation => <MyPageObservation key={observation.id} observation={observation} />) }
      </div>
    )

    if (this.props.user.activated) {
      return (
        <div>
          <div>
            <h1>Oma sivu</h1>
            <div style={margin}>
              {this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email})
            </div>
            <div style={notificationStyle}>
              { this.props.userNotification }
            </div>
            <div className="myPageMenu" style={divStyle}>
              <ul>
                <li style={contactsActive} onClick={this.handleMenuClick}><Link to="/omasivu" name="contacts">Käyttäjätiedot</Link></li>
                <li style={observationsActive} onClick={this.handleMenuClick}><Link to="/omasivu" name="observations">Omat havainnot</Link></li>
              </ul>
            </div>
          </div>
          { this.state.menu.contacts ? contacts() : observations() }
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
    user: state.user,
    userNotification: state.userNotification
  }
}

export default connect(
  mapStateToProps,
  { setMarkers, markersForUser, emptyMarkers, initializeUser, initNotification, clearNotification }
)(MyPage)