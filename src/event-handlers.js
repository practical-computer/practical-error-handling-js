import { reflectConstraintValidationForElement } from './rendering.js'
import {
  skipInputValidation,
  skipFocusoutValidation,
  skipValidation,
} from './element-utilities.js'

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

export function liveInputValidationEventHandler(event) {
  let element = event.target
  if(skipInputValidation(element)){ return }
  if(skipValidation(element)){ return }
  reflectConstraintValidationForElement(element)
}

export function focusoutValidationEventHandler(event) {
  let element = event.target
  if(skipFocusoutValidation(element)){ return }
  if(skipValidation(element)){ return }
  reflectConstraintValidationForElement(element)
}