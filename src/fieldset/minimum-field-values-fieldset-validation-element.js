import { FieldsetValidationElement } from './fieldset-validation-element.js'

import {
  skipFieldsetChangeEvent,
  skipFieldsetFocusoutEvent
} from './util.js'

import {
  clearErrorListForFieldset,
  renderCustomErrorMessageForFieldset
} from './rendering.js'

/**
 * Checks that there is at least N values in the `FormData` for the given
 * `fieldName` in the `fieldset`'s form.
 * @param {FieldsetElement} fieldset
 * @param {string} fieldName
 * @param {integer} minimum
 * @return {boolean} if there is at least 1 record for `fieldName` in the fieldset form's `FormData`
 */
export function minimumCountOfFieldNameSelected(fieldset, fieldName, minimum) {
  const formData = new FormData(fieldset.form)
  return formData.getAll(fieldName).length >= minimum
}


/**
 * Calls {@link MinimumFieldValuesFieldsetValidationElement#reportValidity} unless
 * {@link skipFieldsetChangeEvent} returns `true`
 */
export function changeValidationEventHandler(event) {
  if(skipFieldsetChangeEvent(event)){ return }
  const element = event.currentTarget
  element.reportValidity()
}

/**
 * Calls {@link MinimumFieldValuesFieldsetValidationElement#reportValidity} unless
 * {@link focusoutValidationEventHandler} returns `true`
 */
export function focusoutValidationEventHandler(event) {
  if(skipFieldsetFocusoutEvent(event)){ return }
  const element = event.currentTarget
  element.reportValidity()
}

/**
 * @class
 * @classdesc
 * @extends FieldsetValidationElement
 * A custom element that can validate that a minimum number of values for the given `field-name`
 * Match `
 */
export class MinimumFieldValuesFieldsetValidationElement extends FieldsetValidationElement {
  /**
   * Returns the value of the `min`, parsed as an Integer
   */
  get min() {
    return Number.parseInt(this.getAttribute(`min`))
  }

  /**
   * Returns the value of the `validation-message`, throwing a `TypeError`` if it is missing
   */
  get validationMessage() {
    const message = this.getAttribute(`validation-message`)
    if(!message || message.trim() === ""){ throw new TypeError(`validation-message missing`) }

    return message
  }

  /**
   * Returns the value of the `validation-message`, throwing a `TypeError`` if it is missing
   */
  get type() {
    const type = this.getAttribute(`type`)
    if(!type || type.trim() === ""){ throw new TypeError(`type missing`) }

    return type
  }

  /**
   * Calls:
   * - {@link clearErrorListForFieldset}
   * - {@link minimumCountOfFieldNameSelected}
   * - {@link renderCustomErrorMessageForFieldset}
   */
  reportValidity() {
    clearErrorListForFieldset(this.fieldset)

    if(minimumCountOfFieldNameSelected(this.fieldset, this.fieldName, this.min)) {
      return true
    }

    renderCustomErrorMessageForFieldset(this.fieldset, this.validationMessage, this.type)

    return false
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListeners()
  }

  addEventListeners() {
    this.addEventListener(`change`, changeValidationEventHandler)
    this.addEventListener(`focusout`, focusoutValidationEventHandler)

    const element = this
    const submitValidationEventHandler = function (event) {
      const isValid = element.reportValidity()

      if(!isValid) {
        event.preventDefault()
        element.fieldset.querySelector(`input:first-child`).focus()
      }
    }

    this.form.addEventListener(`submit`, submitValidationEventHandler)
  }
}

if (!window.customElements.get('minimum-field-values-fieldset-validation')) {
  window.customElements.define(
    'minimum-field-values-fieldset-validation',
    MinimumFieldValuesFieldsetValidationElement)
  ;
}