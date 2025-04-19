import {
  liveInputValidationEvent,
  focusoutValidationEvent,
  validateFormSubmitEventHandler
} from 'event-handlers.js'

import {
  reflectConstraintValidationForInitialLoad
} from './element-utilities.js'

export class ErrorHandlingElement extends HTMLElement {
  constructor() {
    super();
  }

  get form(){
    return this.querySelector(":scope > form")
  }

  connectedCallback() {
    if(!this.isConnected){ return }

    this.form.setAttribute('novalidate', '')
    this.form.addEventListener('input', liveInputValidationEvent)
    this.form.addEventListener('focusout', focusoutValidationEvent)
    this.form.addEventListener('submit', validateFormSubmit)

    setValidationStateForInitialLoad(this.form)
  }
}