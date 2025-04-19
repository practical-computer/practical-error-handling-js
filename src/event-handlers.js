import {
  skipInputValidation,
  skipFocusoutValidation,
  skipValidation,
  reflectConstraintValidationForElement
} from './element-utilities.js'

/**
 * Calls {@link reflectConstraintValidationForElement} for every `element` in `event.currentTarget.elements`
 *
 * Calls `event.preventDefault()` if form it not valid (via `checkValidity()`)
 *
 * Focuses on the first invalid input, using `input:invalid`
 * @param {Event} event
 */
export function validateFormSubmitEventHandler(event) {
  let formElement = event.currentTarget

  for(const element of formElement.elements) {
    reflectConstraintValidationForElement(element)
  }

  // The isFormValid boolean respresents all inputs that can
  // be validated with the Constraint Validation API.
  const isFormValid = formElement.checkValidity();
  // Prevent form submission if any of the validation checks fail.
  if (!isFormValid) {
    event.preventDefault();
  }

  // Set the focus to the first invalid input.
  const firstInvalidInputEl = formElement.querySelector('input:invalid');
  firstInvalidInputEl?.focus();
}

/**
 * Calls {@link reflectConstraintValidationForElement} if the `event.target` has
 * `data-live-validation` and does not have `data-skip-validation`
 *
 * @param {Event} event
 */
export function liveInputValidationEventHandler(event) {
  let element = event.target
  if(skipInputValidation(element)){ return }
  if(skipValidation(element)){ return }
  reflectConstraintValidationForElement(element)
}

/**
 * Calls {@link reflectConstraintValidationForElement} if the `event.target` has
 * `data-focusout-validation` and does not have `data-skip-validation`
 * @param {Event} event
 */
export function focusoutValidationEventHandler(event) {
  let element = event.target
  if(skipFocusoutValidation(element)){ return }
  if(skipValidation(element)){ return }
  reflectConstraintValidationForElement(element)
}