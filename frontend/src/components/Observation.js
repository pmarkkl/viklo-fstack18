import React from 'react'

const Observation = ({ observation }) => {
  return (
    <div>
    <p>Laji: {observation.species.finnishName} ({observation.species.latinName})</p>
    <p>Havainnon tekijä: {observation.user.firstname} {observation.user.lastname}</p>
    <p>Aika: {observation.date}</p>
    <p>Sijainti: {observation.latitude}, {observation.longitude}</p>
    <br />
    </div>
  )
}

export default Observation