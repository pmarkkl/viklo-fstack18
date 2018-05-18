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
    return (
      <div>
        <h1>Tervetuloa {this.props.user.email}</h1>
        <button onClick={this.logout}>Kirjaudu ulos</button>
        <h2>loginForm</h2>
        <form onSubmit={this.login}>
          Käyttäjä: <input type="text" name="email" value={this.state.email} onChange={this.handleFieldChange} /><br />
          Salasana: <input type="password" name="password" value={this.state.password} onChange={this.handleFieldChange} /><br />
          <button>Kirjaudu</button>
        </form>
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