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
 * calls {@link clearErrorList }.
 * calls {@link renderErrorMessageListItem} for the {@link generateValidationMessage} and replaces the
 * error list to include that message (marked as `data-pf-error-visible`) and any `preserved` errors
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
 * It marks it with the `data-pf-error-visible` attribute`
 * @params {Element} {@link getErrorList}
 * @params {string} type the error type
 */
export function markErrorTypeAsVisible(errorListElement, type) {
  getErrorForType(errorListElement, type)?.toggleAttribute(`data-pf-error-visible`, true)
}

/**
 * Clones the {@link errorListItemTemplate}, setting the textContent of the element with `[data-pf-error-message]` to the message,
 * and setting the `data-pf-error-type` to the given type.
 *
 * @params {string} message the error message
 * @params {string} type the value that will be used for `data-pf-error-type``
 * @returns {Element} the cloned element
 */
export function errorMessageListItem(message, type) {
  const clone = errorListItemTemplate().content.cloneNode(true).querySelector(`*:first-child`)

  clone.setAttribute(`data-pf-error-type`, type)
  clone.querySelector(`[data-pf-error-message]`).textContent = message

  return clone
}

/**
 * Clones the {@link errorListItemTemplate}, parsing the given HTML string and inserting it into the element with `[data-pf-error-message]` to the message,
 * and setting the `data-pf-error-type` to the given type.
 *
 * @params {string} htmlString the HTML content to render in the string
 * @params {string} type the value that will be used for `data-pf-error-type``
 * @returns {Element} the cloned element
 */
export function errorMessageListItemWithHTML(htmlString, type) {
  const clone = errorListItemTemplate().content.cloneNode(true).querySelector(`*:first-child`)

  const parsedDocument = new DOMParser().parseFromString(htmlString, "text/html")

  clone.setAttribute(`data-pf-error-type`, type)
  clone.querySelector(`[data-pf-error-message]`).replaceChildren(parsedDocument.body.firstChild)
  return clone
}

/**
 * Clears the error messages from the list, while keeping preserved errors.
 * Removes the `data-pf-error-visible` attribute from any preserved attributes
 * @param {Element} element
 */
export function clearErrorList(errorListElement) {
  const preservedErrors = [...getPreservedErrors(errorListElement)]

  preservedErrors.forEach((x) => {
    x.removeAttribute(`data-pf-error-visible`)
  })

  errorListElement.replaceChildren(...preservedErrors)
}

/**
 * Clears all the error containers for the `elements` in the given `form`, including its fallback error section
 * @param {FormElement} the form to clear
 */
export function clearErrorListsInForm(form) {
  for(const element of form.elements) {
    if(hasErrorContainer(element)) {
      clearErrorList(getErrorList(element))
    }
  }

  if(hasErrorContainer(form)) {
    clearErrorList(getErrorList(form))
  }
}