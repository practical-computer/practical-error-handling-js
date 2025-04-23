import { renderConstraintValidationMessageForElement } from './rendering.js'

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
 * Checks if the given `element` has `data-validation == "input"`
 * @param {Element} element
 * @return {boolean} Returns true if the element does not have `data-validation == "input"`
 */
export function skipInputValidation(element) {
  return !(element.getAttribute(`data-validation`) === "input")
}

/**
 * Checks if the given `element` has `data-validation == "change"`
 * @param {Element} element
 * @return {boolean} Returns true if the element does not have `data-validation == "change"`
 */
export function skipChangeValidation(element) {
  return !(element.getAttribute(`data-validation`) === "change")
}

/**
 * Checks if the given `element` has `data-validation == "focusout"`
 * @param {Element} element
 * @return {boolean} Returns true if the element does not have `data-validation == "focusout"`
 */
export function skipFocusoutValidation(element) {
  return !(element.getAttribute(`data-validation`) === "focusout")
}

/**
 * Checks if the given `element` given `element` has `data-validation == "skip"`
 * @param {Element} element
 * @return {boolean} Returns true if the element has `data-validation == "change"`
 */
export function skipValidation(element) {
  return (element.getAttribute(`data-validation`) === "skip")
}

/**
 * Calls `checkValidity` on the given `element` and updates the DOM appropriately
 * @params {Element} element
 */
export function reflectConstraintValidationForElement(element) {
  if(!element.checkValidity){ return }
  const isInputValid = element.checkValidity();
  if (!element.required && element.value === '' && isInputValid) {
    setValidityStateAttributes(element, true)
  } else {
    setValidityStateAttributes(element, isInputValid)
  }

  renderConstraintValidationMessageForElement(element)
}

/**
 * Sets `aria-invalid` based on the given `isValid`
 * @params {Element} element the element to apply the validity state attributes to
 * @params {boolean} isValid whether or not the given element is valid
 */
export function setValidityStateAttributes(element, isValid) {
  // Update the `aria-invalid` state based on the given validity boolean.
  element.setAttribute(`aria-invalid`, (!isValid).toString());
}

/**
 * Used for the initial loading of the given `form`, calls {@link reflectConstraintValidationForElement} for each
 * non-blank item in `form.element` that does not have a `data-initial-load-errors`
 * @params {FormElement} form the form to reflect the initial Constraint Validation state for
 */
export function reflectConstraintValidationForInitialLoad(form) {
  for(const element of form.elements) {
    if(element.hasAttribute(`data-initial-load-errors`)) {
      continue; // do not change any elements that have server-side errors
    }
    if(element.value !=="" ){
      reflectConstraintValidationForElement(element)
    }
  }
}