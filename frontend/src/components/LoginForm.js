import React from 'react'
import loginService from '../services/login'
import { connect } from 'react-redux'
import { initializeUser } from '../reducers/userReducer'

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
      this.props.initializeUser(response)
    }
  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    return (
      <div>
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

export default connect (
  null,
  { initializeUser }
) (LoginForm)