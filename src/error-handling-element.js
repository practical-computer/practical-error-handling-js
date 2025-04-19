import {
  liveInputValidationEventHandler,
  focusoutValidationEventHandler,
  validateFormSubmitEventHandler
} from './event-handlers.js'

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
    this.form.addEventListener('input', liveInputValidationEventHandler)
    this.form.addEventListener('focusout', focusoutValidationEventHandler)
    this.form.addEventListener('submit', validateFormSubmitEventHandler)

    reflectConstraintValidationForInitialLoad(this.form)
  }
}