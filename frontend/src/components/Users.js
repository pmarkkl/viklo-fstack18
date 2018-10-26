import React from 'react'
import { connect } from 'react-redux'
import { initUsers } from '../reducers/usersReducer'
import User from './User'

class Users extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentWillMount() {
    this.props.initUsers()
  }

  click = (event) => {
    event.preventDefault()
    console.log(this.props.users)
  }

  render() {
    return (
      <div>
        <h1>Käyttäjät</h1>
        { this.props.users.map(user => <User key={user.id} user={user} />) }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users
  }
}

export default connect (
  mapStateToProps,
  { initUsers }
)(Users)