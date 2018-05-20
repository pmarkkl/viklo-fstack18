import React from 'react'
import loginService from '../services/login'
import { connect } from 'react-redux'
import { initializeUser } from '../reducers/userReducer'
import { logout } from '../reducers/userReducer'

class LoginForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
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

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {

    const loginform = () => (
      <div>
        <h2>Kirjaudu sisään</h2>
        <form onSubmit={this.login}>
          Käyttäjä: <input type="text" name="email" value={this.state.email} onChange={this.handleFieldChange} /><br />
          Salasana: <input type="password" name="password" value={this.state.password} onChange={this.handleFieldChange} /><br />
          <button>Kirjaudu</button>
        </form>
      </div>
    )

    const logoutform = () => (
      <div>
        <h1>{this.props.user.email} logged in</h1>
        <p><button onClick={this.logout}>Kirjaudu ulos</button></p>
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