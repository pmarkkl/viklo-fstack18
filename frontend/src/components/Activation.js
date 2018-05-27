import React from 'react'
import activationService from '../services/activation'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { activateUser } from '../reducers/userReducer'

class Activation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
  }

  componentWillMount() {
    this.activate()
  }

  activate = async () => {
    const activationObject = {
      token: this.props.match.params.id
    }
    const response = await activationService.activate(activationObject)
    console.log(response)
    if (response.error) {
      this.setState({ message: response.error })
    } else {
      this.setState({ message: `Tunnus ${response.email} on nyt aktivoitu.` })
    }
  }

  render() {
    return (
      <div>
        <h2>Tunnuksen aktivointi</h2>
        <p>{this.state.message}</p>
        <Link to="/">Jatka kirjautumiseen.</Link>
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
  { activateUser }
)(Activation)