export function generateValidationMessage(element) {
  if(element.validity.valid){ return ''}
  return element.validationMessage
}
