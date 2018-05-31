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
      passwordConfirmation: '',
      reg: {
        visibility: false,
        message: [],
      },
      login: {
        visibility: false,
        message: ''
      },
      notActivated: false,
      timeoutId: ''
    }
  }

  componentWillMount() {
    clearTimeout(this.state.timeoutId)
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
        const id = setTimeout(() => this.setState({ login: { message: '' }}), 5000)
        this.setState({ timeoutId: id })
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
      password: this.state.newUserPassword,
      passwordConfirmation: this.state.passwordConfirmation
    }

    const response = await userService.newUser(requestObject)
    console.log(response)

    if (response.error) {
      this.setState({ reg: { visibility: true, message: response.error }, newUserEmail: '', newUserPassword: '', passwordConfirmation: ''})
      const id = setTimeout(() => this.setState({ reg: { visibility: false, message: [] } }), 7500)
      this.setState({ timeoutId: id })
    } else {
      const message = [`Tervetuloa käyttäjäksi, ${response.firstname}. Sähköpostiisi ${response.email} on lähetetty aktivointilinkki.`]
      this.setState({ 
        reg: { visibility: true, message },
        newUserEmail: '',
        newUserFirstname: '',
        newUserLastname: '',
        newUserPassword: '',
        passwordConfirmation: ''
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
      marginTop: '15px',
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '2px',
      paddingBottom: '2px',
      fontSize: '12pt',
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
          <input type="text" autoComplete="user-email" name="email" value={this.state.email} onChange={this.handleFieldChange} placeholder="Sähköposti"/><br />
          <input type="password" autoComplete="user-password" name="password" value={this.state.password} onChange={this.handleFieldChange} placeholder="Salasana" /><br />
          <button>Kirjaudu</button><br />
          <Link to="/resetpassword">Oletko unohtanut salasanasi?</Link>
        </form>
        <h1>Rekisteröidy</h1>
        { regSuccess() }
        <form onSubmit={this.register} autoComplete="on">
          <input type="text" autoComplete="new-user-email" name="newUserEmail" value={this.state.newUserEmail} onChange={this.handleFieldChange} placeholder="Sähköposti" /><br />
          <input type="text" autoComplete="new-user-firstname" name="newUserFirstname" value={this.state.newUserFirstname} onChange={this.handleFieldChange} placeholder="Etunimi" /><br />
          <input type="text" autoComplete="new-user-lastname" name="newUserLastname" value={this.state.newUserLastname}onChange={this.handleFieldChange} placeholder="Sukunimi" /><br />
          <input type="password" autoComplete="new-password" name="newUserPassword" value={this.state.newUserPassword} onChange={this.handleFieldChange} placeholder="Salasana" /><br />
          <input type="password" autoComplete="new-password" name="passwordConfirmation" value={this.state.passwordConfirmation} onChange={this.handleFieldChange} placeholder="Salasana uudelleen" /><br />
          <button>Rekisteröidy</button>
        </form>
      </div>
    )

    const style = {
    }

    const notActivated = () => (
      <p>Käyttäjätunnustasi ei ole aktivoitu. Tarkista postilaatikkosi, tai <Link to="/resend">lähetä aktivointilinkki uudestaan.</Link></p>
    )

    const logoutform = () => (
      <div style={style}>
        <h1>Kirjautuminen onnistui</h1>
        {this.props.user.firstname} {this.props.user.lastname} ({this.props.user.email}) kirjautuneena.<br />
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