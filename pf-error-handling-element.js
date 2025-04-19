import {ErrorHandlingElement} from "./src/error-handling-element.js"

if (!window.customElements.get('pf-error-handling')) {
  window.customElements.define('pf-error-handling', ErrorHandlingElement);
}