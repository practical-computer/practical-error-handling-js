/**
 * Returns the `validationMessage` for an element if it is present
 * @param {Element} element
 * @return {string} The `element.validationMessage`, or an empty string
 */
export function generateValidationMessage(element) {
  if(element.validity.valid){ return ''}
  return element.validationMessage
}


/**
 * Checks if the given `element` has the `data-live-validation` attribute
 * @param {Element} element
 * @return {boolean}
 */
export function skipInputValidation(element) {
  return !element.hasAttribute(`data-live-validation`)
}