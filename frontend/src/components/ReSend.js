import React from 'react'
import activationRouter from '../services/activation'
import { Redirect } from 'react-router-dom'

const send = async (id) => {
  const response = await activationRouter.resend(id)
  console.log(response)
}

const ReSend = ({ user }) => {
  if (user.email) {
    send(user.id)
    return (
      <div>
        <p>Osoitteeseen {user.email} lähetetty uusi aktivointilinkki.</p>
      </div>
    )
  } else {
    return (
      <Redirect to="/" />
    )
  }
}

export default ReSend