import React from 'react'
import loginService from '../services/login'
import { connect } from 'react-redux'
import { initializeUser } from '../reducers/userReducer'
import userService from '../services/users'
import { Link } from 'react-router-dom'

class LoginForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      newUserEmail: '',
      newUserFirstname: '',
      newUserLastname: '',
      newUserPassword: '',
      reg: {
        visibility: false,
        message: [],
      },
      login: {
        visibility: false,
        message: ''
      },
      notActivated: false
    }
  }

  login = async (event) => {
    event.preventDefault()

    const response = await loginService.login({
      email: this.state.email,
      password: this.state.password
    })

    if (response.token) {
      window.localStorage.setItem('loggedInUser', JSON.stringify(response))
      this.props.initializeUser(response)
      console.log(response)
    } else {
      if (response.notActivated) {
        this.setState({ login: { message: '', visibility: true }, email: '', password: '', notActivated: true })
        console.log(response)
        this.props.initializeUser({id: response.id, email: response.email})
      } else {
        console.log(response)
        this.setState({ notActivated: false, login: { message: response.error, visibility: true }})
        setTimeout(() => this.setState({ login: { message: '' }}), 5000)
      }
    }
    this.setState({ email: '', password: '' })
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

    if (response.error) {
      this.setState({ reg: { visibility: true, message: response.error }, newUserEmail: '', newUserPassword: ''})
      setTimeout(() => 
        this.setState({ reg: { visibility: false, message: [] } })
      ,7500)
    } else {
      const message = [`Tervetuloa käyttäjäksi, ${response.firstname}. Sähköpostiosoitteeseesi ${response.email} on lähetetty aktivointilinkki.`]
      this.setState({ 
        reg: { visibility: true, message },
        newUserEmail: '',
        newUserFirstname: '',
        newUserLastname: '',
        newUserPassword: ''
      })
    }

  }

  handleFieldChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {

    const loginInfoStyle = {
      display: this.state.login.visibility ? '' : 'none',
      backgroundColor: '#f7f7f7',
      marginTop: '5px',
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '3px',
      paddingBottom: '3px',
      fontSize: '11pt',
      color: 'black',
    }

    const regInfo = {
      display: this.state.reg.visibility ? '' : 'none',
      backgroundColor: '#f7f7f7',
      marginTop: '5px',
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '3px',
      paddingBottom: '3px',
      fontSize: '11pt',
      color: 'black',
    }

    const regSuccess = () => (
      <div style={regInfo}>
        { this.state.reg.message.map(message => <p key={message}>{message}</p>) }
      </div>
    )

    const eiHelvetti = {
      display: this.state.notActivated ? '' : 'none'
    }

    const loginInfo = () => (
      <div style={loginInfoStyle}>
        <p>{this.state.login.message}</p>
        <div style={eiHelvetti}>
          {notActivated()}
        </div>
    </div>
    )

    const loginform = () => (
      <div>
        { loginInfo() }
        <h1>Kirjaudu</h1>
        <form onSubmit={this.login} autoComplete="on">
          <input type="text" name="email" value={this.state.email} onChange={this.handleFieldChange} placeholder="Sähköposti"/><br />
          <input type="password" name="password" value={this.state.password} onChange={this.handleFieldChange} placeholder="Salasana" /><br />
          <button>Kirjaudu</button>
        </form>
        <h1>Rekisteröidy</h1>
        { regSuccess() }
        <form onSubmit={this.register} autoComplete="on">
          <input type="text" name="newUserEmail" value={this.state.newUserEmail} onChange={this.handleFieldChange} placeholder="Sähköposti" /><br />
          <input type="text" name="newUserFirstname" value={this.state.newUserFirstname} onChange={this.handleFieldChange} placeholder="Etunimi" /><br />
          <input type="text" name="newUserLastname" value={this.state.newUserLastname}onChange={this.handleFieldChange} placeholder="Sukunimi" /><br />
          <input type="password" name="newUserPassword" value={this.state.newUserPassword} onChange={this.handleFieldChange} placeholder="Salasana" /><br />
          <button>Rekisteröidy</button>
        </form>
      </div>
    )

    const style = {
      padding: '30px'
    }

    const notActivated = () => (
      <p>Käyttäjätunnustasi ei ole aktivoitu. Tarkista postilaatikkosi, tai <Link to="/resend">lähetä aktivointilinkki uudestaan.</Link></p>
    )

    const logoutform = () => (
      <div style={style}>
        {this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email}) logged in<br />
        <button onClick={this.props.logout}>Kirjaudu ulos</button>
        {this.props.user.activated ? '' : notActivated()}
      </div>
    )

    return (
      <div>
        { this.props.user.activated ? logoutform() : loginform() }
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
  { initializeUser }
) (LoginForm)