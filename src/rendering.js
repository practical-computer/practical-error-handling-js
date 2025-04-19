import { generateValidationMessage } from './element-utilities.js'

import {
  hasErrorContainer,
  getPreservedErrors,
  getErrorList,
  errorListItemTemplate,
  hasPreservedErrorForType,
  getErrorForType
} from './error-containers.js'

/**
 * Renders the error list for the given `element` based on the Constraint Validation API state.
 *
 * If the `element` is valid, calls {@link clearErrorList }.
 * Otherwise calls {@link renderErrorMessageListItem} for the {@link generateValidationMessage} and replaces the
 * error list to include that message (marked as `data-visible`) and any `preserved` errors
 *
 * @param {Element} element
 */
export function renderConstraintValidationMessageForElement(element) {
  if(!hasErrorContainer(element)){ return }

  const errorListElement = getErrorList(element)

  clearErrorList(errorListElement)

  if(element.validity.valid){
    return
  }

  const validity = element.validity
  for(var key in validity){
    var result = validity[key]
    if(!result || key == "valid") { continue }

    if(!hasPreservedErrorForType(errorListElement, key)){
      let listItem = errorMessageListItem(generateValidationMessage(element), key)
      errorListElement.append(listItem)
    }

    markErrorTypeAsVisible(errorListElement, key)
  }
}

/**
 * Checks the given `errorListElement` for an error of the given `type`. If it's present,
 * It marks it with the `data-visible` attribute`
 * @params {Element} {@link getErrorList}
 * @params {string} type the error type
 */
export function markErrorTypeAsVisible(errorListElement, type) {
  getErrorForType(errorListElement, type)?.toggleAttribute(`data-visible`, true)
}

/**
 * Clones the {@link errorListItemTemplate}, setting the textContent of the element with `[data-error-message]` to the message,
 * and setting the `data-error-type` to the given type.
 *
 * @params {string} message the error message
 * @params {string} type the value that will be used for `data-error-type``
 * @returns {Element} the cloned element
 */
export function errorMessageListItem(message, type) {
  const clone = errorListItemTemplate().content.cloneNode(true).querySelector(`*:first-child`)

  clone.setAttribute(`data-error-type`, type)
  clone.querySelector(`[data-error-message]`).textContent = message

  return clone
}

/**
 * Clears the error messages from the list, while keeping preserved errors.
 * Removes the `data-visible` attribute from any preserved attributes
 * @param {Element} element
 */
export function clearErrorList(errorListElement) {
  const preservedErrors = [...getPreservedErrors(errorListElement)]

  preservedErrors.forEach((x) => {
    x.removeAttribute(`data-visible`)
  })

  errorListElement.replaceChildren(...preservedErrors)
}