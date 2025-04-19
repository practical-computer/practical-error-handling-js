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
 * Checks if the given `element` has the `data-live-validation` attribute
 * @param {Element} element
 * @return {boolean} Returns true if the element does not have the `data-live-validation` attribute`
 */
export function skipInputValidation(element) {
  return !element.hasAttribute(`data-live-validation`)
}

/**
 * Checks if the given `element` has the `data-focusout-validation` attribute
 * @param {Element} element
 * @return {boolean} Returns true if the element does not have the `data-focusout-validation` attribute`
 */
export function skipFocusoutValidation(element) {
  return !element.hasAttribute(`data-focusout-validation`)
}

/**
 * Checks if the given `element` has the `data-skip-validation` attribute
 * @param {Element} element
 * @return {boolean} Returns true if the element has the `data-skip-validation` attribute`
 */
export function skipValidation(element) {
  return element.hasAttribute(`data-skip-validation`)
}

/**
 * Calls `checkValidity` on the given `element` and updates the DOM appropriately
 * @params {Element} element
 */
export function reflectConstraintValidationForElement(element) {
  if(!element.checkValidity){ return }
  const isInputValid = element.checkValidity();
  if (!element.required && element.value === '' && isInputValid) {
    // Clear validation state
    element.removeAttribute(`data-is-invalid`);
  } else {
    // Toggle valid/invalid state data attribute
    element.toggleAttribute(`data-is-invalid`, !isInputValid);
  }
  // Update the `aria-invalid` state based on the input's validity.
  element.setAttribute(`aria-invalid`, (!isInputValid).toString());
  renderConstraintValidationMessageForElement(element)
}

/**
 * Used for the initial loading of the given `form`, calls {@link reflectConstraintValidationForElement} for each
 * non-blank item in `form.element` that does not have a `data-server-side-errors`
 * @params {FormElement} form the form to reflect the initial Constraint Validation state for
 */
export function reflectConstraintValidationForInitialLoad(form) {
  for(const element of form.elements) {
    if(element.hasAttribute(`data-server-side-errors`)) {
      continue; // do not change any elements that have server-side errors
    }
    if(element.value !=="" ){
      reflectConstraintValidationForElement(element)
    }
  }
}