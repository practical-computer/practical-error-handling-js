import {
  liveInputValidationEventHandler,
  focusoutValidationEventHandler,
  validateFormSubmitEventHandler
} from './event-handlers.js'

import {
  reflectConstraintValidationForInitialLoad
} from './element-utilities.js'

/**
 * A Custom Element class that can be subclassed, allowing you to customize
 * how error handling works in your client-side code.
 *
 * @class
 *
 * @example
 *
 *
 * class CustomErrorHandleElement extends ErrorHandlingElement {
 *   get customProperty() {
 *     return "hello"
 *   }
 * }
 *
 * if (!window.customElements.get('custom-error-handling')) {
 *   window.customElements.define('custom-error-handling', CustomErrorHandleElement);
 * }
 */
export class ErrorHandlingElement extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * The immediate child `form` element in this custom element
   */
  get form(){
    return this.querySelector(":scope > form")
  }

  /**
   * Prepares the custom element to be connected to the page.
   *
   * Attaches the following event handlers to the `form`:
   * - {@link liveInputValidationEventHandler}
   * - {@link focusoutValidationEventHandler}
   * - {@link validateFormSubmitEventHandler}
   *
   * Calls {@link reflectConstraintValidationForInitialLoad}
   *
   * Sets the `novalidate` attribute on the `form`
   */
  connectedCallback() {
    if(!this.isConnected){ return }

    this.form.setAttribute('novalidate', '')
    this.form.addEventListener('input', liveInputValidationEventHandler)
    this.form.addEventListener('focusout', focusoutValidationEventHandler)
    this.form.addEventListener('submit', validateFormSubmitEventHandler)

    reflectConstraintValidationForInitialLoad(this.form)
  }
}