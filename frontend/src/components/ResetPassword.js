
import React from 'react'
import userService from '../services/users'
import { Redirect, Link } from 'react-router-dom'

class ResetPassword extends React.Component {

  state = {
    email: '',
    success: false,
    redirect: false,
    infoWindowVisibility: false,
    timeoutId: ''
  }

  componentWillUnmount() {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId)
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()

    const emailSplitDot = this.state.email.split('.')
    const emailSplitAt = this.state.email.split('@')

    if (emailSplitDot.length < 2 || emailSplitAt.length < 2) {
      return this.setState({ infoWindowVisibility: true, email: '' })
    }

    const response = await userService.resetPassword(this.state.email)
    if (response.data.message === 'Success') {
      this.setState({ success: true })
      const id = setTimeout(() => this.setState({ redirect: true }), 5000)
      console.log('setTimeout id', id)
      this.setState({ timeoutId: id })
    }
  }

  handleChange = (event) => {
    this.setState({ email: event.target.value })
  }

  render() {

    const infoWindow = {
      display: this.state.infoWindowVisibility ? '' : 'none',
      color: 'red'
    }

    const form = () => (
      <div>
        <div style={infoWindow}>
          Syötä kelvollinen sähköpostiosoite.
        </div>
        Anna sähköpostisi:<br />
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="email" value={this.state.email} onChange={this.handleChange} /><br />
          <button type="submit">Lähetä</button>
        </form>
      </div>
    )

    const success = () => (
      <div>
        <p>Osoitteeseen {this.state.email} lähetetty salasanan resetointilinkki.</p>
        <Link to="/">Ohjataan takaisin etusivulle...</Link>
      </div>
    )

    if (this.state.redirect) {
      return (
        <div>
          <Redirect to="/" />
        </div>
      )
    } else {
      return (
        <div>
          <h1>Salasanan resetointi</h1>
          <div>{this.state.success ? success() : form()}</div>
        </div>
      )
    }
  }
}

export default ResetPassword