import React from 'react'
import loginService from '../services/login'
import { connect } from 'react-redux'
import { initializeUser } from '../reducers/userReducer'
import { logout } from '../reducers/userReducer'
import userService from '../services/users'

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
      <div>
        <h3>Kirjaudu sisään</h3>
        <form onSubmit={this.login}>
          Käyttäjä:<br/> <input type="text" name="email" value={this.state.email} onChange={this.handleFieldChange} /><br />
          Salasana:<br /> <input type="password" name="password" value={this.state.password} onChange={this.handleFieldChange} /><br />
          <input type="submit" value="Kirjaudu" />
        </form>
        <h3>Oletko uusi jäsen? Rekisteröidy alla.</h3>
        <form onSubmit={this.register}>
          Sähköposti:<br/> <input type="text" name="newUserEmail" value={this.state.newUserEmail} onChange={this.handleFieldChange} /><br />
          Etunimi:<br /> <input type="text" name="newUserFirstname" value={this.state.newUserFirstname} onChange={this.handleFieldChange} /><br />
          Sukunimi:<br/> <input type="text" name="newUserLastname" value={this.state.newUserLastname} onChange={this.handleFieldChange} /><br />
          Salasana:<br /> <input type="password" name="newUserPassword" value={this.state.newUserPassword} onChange={this.handleFieldChange} /><br />
          <button>Rekisteröidy</button>
        </form>
      </div>
    )

    const logoutform = () => (
      <div>
        <p>{this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email}) logged in</p>
        <p><input type="submit" onClick={this.logout} value="Kirjaudu ulos" /></p>
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