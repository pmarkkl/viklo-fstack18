import React from 'react'
import resetService from '../services/reset'
import userService from '../services/users'
import { Redirect, Link } from 'react-router-dom'

class SetPasswordReset extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: '',
      newPassword: '',
      passwordConfirmation: '',
      valid: true,
      response: {},
      success: false,
      redirect: false,
      user: {}
    }
  }

  componentWillMount() {
    this.checkValidity()
  }

  checkValidity = async () => {
    const response = await resetService.checkValidity(this.props.match.params)
    if (!response.user || !response.randomBytes) {
      this.setState({ valid: false })
    } else {
      this.setState({ response })
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const passwords = {
      newPassword: this.state.newPassword,
      passwordConfirmation: this.state.passwordConfirmation,
      user: this.state.response.user,
      randomBytes: this.state.response.randomBytes
    }
    const response = await userService.setPasswordAfterReset(passwords)
    console.log(response)
    if (response.error) {
      this.setState({ error: response.error, newPassword: '', passwordConfirmation: '' })
    }
    if (response.email) {
      this.setState({ success: true, user: response })
      setTimeout(() => this.setState({ redirect: true }),5000)
    }
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const divStyle = {
      paddingTop: '10px'
    }

    const notValid = () => (
      <Redirect to="/" />
    )

    const error = {
      color: 'red',
      marginBottom: '10px'
    }

    const valid = () => (
      <div style={divStyle}>
        <h1>Aseta uusi salasana</h1>
        <div style={error}>{this.state.error}</div>
        <form onSubmit={this.handleSubmit}>
          <input type="password" name="newPassword" placeholder="Salasana" value={this.state.newPassword} onChange={this.handleFieldChange} /><br/>
          <input type="password" name="passwordConfirmation" placeholder="Salasana uudelleen" value={this.state.passwordConfirmation} onChange={this.handleFieldChange} /><br/>
          <button>Lähetä</button>
        </form>
      </div>
    )

    const validOrNot = () => (
      <div>{ this.state.valid ? valid() : notValid() }</div>
    )

    const success = () => (
      <div style={divStyle}>
        <h1>Salasana muutettu onnistuneesti</h1>
        <p>Salasana muutettu tunnukselle {this.state.user.email}.</p>
        <Link to="/">Ohjataan takaisin kirjautumissivulle...</Link>
      </div>
    )

    if (this.state.redirect) {
      return (
        <Redirect to="/" />
      )
    } else {
      return (
        <div>{ this.state.success ? success() : validOrNot() }</div>
      )
    }
  }

}

export default SetPasswordReset