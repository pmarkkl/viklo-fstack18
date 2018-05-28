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

module.exports = {
  validateRegForm
}