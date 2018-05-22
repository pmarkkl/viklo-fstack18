import React from 'react'
import loginService from '../services/login'
import { connect } from 'react-redux'
import { initializeUser } from '../reducers/userReducer'
import { logout } from '../reducers/userReducer'
import userService from '../services/users'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

class LoginForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      newUserEmail: '',
      newUserFirstname: '',
      newUserLastname: '',
      newUserPassword: ''
    }
  }

  login = async (event) => {
    event.preventDefault()
    const response = await loginService.login({
      email: this.state.email,
      password: this.state.password
    })
    if (response.token) {
      this.setState({ email: '', password: '' })
      window.localStorage.setItem('loggedInUser', JSON.stringify(response))
      this.props.initializeUser(response)
    }
  }

  logout = async (event) => {
    console.log('logout triggered')
    event.preventDefault()
    window.localStorage.removeItem('loggedInUser')
    this.props.logout()
  }

  register = async (event) => {
    event.preventDefault()
    const requestObject = {
      email: this.state.newUserEmail,
      firstname: this.state.newUserFirstname,
      lastname: this.state.newUserLastname,
      password: this.state.newUserPassword
    }
    const response = await userService.newUser(requestObject)
    console.log(response)
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {

    const loginform = () => (
      <div id="loginForm">
        <h3>Kirjaudu sisään</h3>
        <form onSubmit={this.login} autoComplete="on">
          <FormGroup>
            <ControlLabel>Sähköposti:</ControlLabel>
            <FormControl type="text" name="email" onChange={this.handleFieldChange} />
            <ControlLabel>Salasana: </ControlLabel>
            <FormControl type="password" name="password" onChange={this.handleFieldChange} />
            <Button bsStyle="success" type="submit">Kirjaudu</Button>
          </FormGroup>
        </form>
        <h3>Rekisteröityminen</h3>
        <form onSubmit={this.register} autoComplete="on">
          <FormGroup>
              <ControlLabel>Sähköposti:</ControlLabel>
              <FormControl type="text" name="newUserEmail" onChange={this.handleFieldChange} />
              <ControlLabel>Etunimi:</ControlLabel>
              <FormControl type="text" name="newUserFirstname" onChange={this.handleFieldChange} />
              <ControlLabel>Sukunimi:</ControlLabel>
              <FormControl type="text" name="newUserLastname" onChange={this.handleFieldChange} />
              <ControlLabel>Salasana: </ControlLabel>
              <FormControl type="password" name="newUserPassword" onChange={this.handleFieldChange} />
              <Button bsStyle="primary" type="submit">Rekisteröidy</Button>
            </FormGroup>
        </form>
      </div>
    )

    const logoutform = () => (
      <div>
        <h3>{this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email}) logged in</h3>
        <Button bsStyle="danger" onClick={this.logout}>Kirjaudu ulos</Button>
    </div>
    )

    return (
      <div>
        { this.props.user.length < 1 ? loginform() : logoutform() }
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect (
  mapStateToProps,
  { initializeUser, logout }
) (LoginForm)