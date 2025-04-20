import { cloneNodesObserver } from '../util.js'
import { getErrorListFromContainer, getErrorContainer } from '../error-containers.js'

/**
 * @class
 * @classdesc
 * An abstract class that can be subclassed to provide specific validation
 * scenarios for a fieldset. For example: {@link MinimumCheckboxValuesFieldsetValidationElement}
 * is a subclass that validates that at least one value for the field name specified in
 * this element is present in the `FormData`
 */
export class FieldsetValidationElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if(!this.isConnected){ return }
    this.setupErrorListCloning()
  }

  /**
   * Calls {@link cloneNodesObserver} to
   * clone {@link FieldsetValidationElement#errorContainer} into
   * {@link FieldsetValidationElement#errorContainerARIA} and keep them in sync.
   */
  setupErrorListCloning() {
    cloneNodesObserver(
      getErrorListFromContainer(this.errorContainer),
      getErrorListFromContainer(this.errorContainerARIA)
    )
  }

  /**
   * The `form` of the {@link FieldsetValidationElement#fieldset}
   */
  get form() {
    return this.fieldset.form
  }

  /**
   * The element with the ID from the `fieldset` attribute
   */
  get fieldset() {
    return document.getElementById(this.getAttribute(`fieldset`))
  }

  /**
   * The `field-name` attribute`
   */
  get fieldName() {
    return this.getAttribute(`field-name`)
  }

  /**
   * See {@link getErrorContainer}, uses {@link FieldsetValidationElement#fieldset}
   */
  get errorContainer(){
    return getErrorContainer(this.fieldset);
  }

  /**
   * The element with the ID from the `error-container-aria` attribute
   */
  get errorContainerARIA(){
    return document.getElementById(this.getAttribute(`error-container-aria`))
  }
}
