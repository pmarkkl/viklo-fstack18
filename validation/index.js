const validateRegForm = (values) => {

  const errors = []

  if (values.firstname.length < 3 || values.firstname.length > 25) {
    errors.push('Syötä etunimesi.')
  }

  if (values.lastname.length < 3 || values.lastname.length > 25) {
    errors.push('Syötä sukunimesi.')
  }

  if (values.email.split("@").length < 2 || values.email.length < 5 || values.email.length > 60) {
    errors.push('Syötä kelvollinen sähköposti.')
  }

  if (values.password.length < 6 || values.password.length > 20) {
    errors.push('Anna 6-20 merkkiä pitkä salasana.')
  }

  if (values.password !== values.passwordConfirmation) {
    errors.push('Salasanat eivät täsmää.')
  }

  return errors
}

// ilmeisesti null Date on 01-01-1970

const validateObservationPost = (values) => {
  const errors = []

  const dateObject = new Date(values.date)
  const dateCompare = new Date(Date.now())
  dateCompare.setFullYear(dateCompare.getFullYear()-5)

  if (Number(values.number) < 1 || Number(values.number) > 10000) {
    errors.push('Anna kelvollinen lukumäärä.')
  }

  sexes = ['Naaras', 'Uros', 'undefined']

  if (sexes.indexOf(values.sex) < 0) {
    errors.push('Sukupuolen valitsemisessa virhe.')
  }

  if (values.speciesId.length < 10 || !values.latitude || !values.longitude) {
    errors.push('Muut kentät kuin kommentti ovat pakollisia.')
  }

  if (dateObject < dateCompare) {
    errors.push('Emme valitettavasti hyväksy yli viiden vuoden takaisia havaintoja.')
  }

  if (dateObject > Date.now()) {
    errors.push('Emme valitettavasti hyväksy havaintoja tulevaisuudesta.')
  }

/*   if (values.zipcode.length < 5 || values.zipcode.length > 5 || values.town.length < 2) {
    errors.push('Tarvitsemme validit osoitetiedot.')
  } */
  console.log('errors', errors)
  return errors
}

const validateContacts = (values) => {
  const errors = []
  console.log('values', values)
    if (values.address.length < 5 || values.address.length > 40) {
      errors.push('Katuosoitteessa näyttäisi olevan jotain vikaa.')
    }
    if (values.town.length < 2 || values.town.length > 35) {
      errors.push('Kunnassa näyttäisi olevan jotain vikaa.')
    }
    if (values.zipcode.length < 5 || values.zipcode.length > 5) {
      errors.push('Postinumero ei ole syötetty oikein.')
    }
    return errors
}

module.exports = {
  validateRegForm, validateObservationPost, validateContacts
}