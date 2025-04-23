import {
  setValidityStateAttributes
} from './element-utilities.js'

import {
  getErrorContainer,
  getErrorListFromContainer,
  hasPreservedErrorForType,
  getPreservedErrorForType,
  markAsPreservedError,
} from './error-containers.js'

import {
  clearErrorListsInForm,
  errorMessageListItem,
  markErrorTypeAsVisible
} from './rendering.js'

/**
 * - Clears the error lists for the given `form`
 * - Takes a given array of error mappings and
 *   1. Calls {@link setValidityStateAttributes} with `false` for the element with the ID of `element_to_invalidate_id`, if it's present
 *   2. Renders the error in the error container; either for this `element` or for the `form` if that is missing. See {@link getError}
 *
 * Note that if there is a preserved error in the container for this `type`, it will be replaced by a new `preserved` error,
 * since it's assumed that the error message is coming from a source of truth.
 *
 * @param {FormElement} form - the `form` element to apply the errors to
 * @param {Object[]} errors - The list of errors that describe this form's current state
 * @param {string} errors[].container_id - The ID of the container this error message should be rendered in
 * @param {string} errors[].element_id - The ID of the element to call {@link setValidityStateAttributes} with `false` for
 * @param {string} errors[].message - the error message
 * @param {string} errors[].type - the value for `data-pf-error-type` that represents the type of error this is
 *
 * @example
 * // For example, a JSON response from a fetch request
 * const errors = [
 *   {
 *     container_id: "name-field-errors",
 *     element_to_invalidate_id: "name-field",
 *     message: "Cannot be blank.",
 *     type: "valueMissing"
 *   },
 *   {
 *     container_id: "name-field-errors",
 *     element_to_invalidate_id: "name-field",
 *     message: "Cannot be blank.",
 *     type: "server_side_type"
 *   }
 * ]
 *
 * applyErrorMappingToForm(form, errors)
 */
export function applyErrorMappingToForm(form, errors) {
  clearErrorListsInForm(form)

  const fallbackErrorSection = getErrorContainer(form)

  for(const error of errors) {
    var elementToInvalidate = document.getElementById(error.element_to_invalidate_id)

    var errorContainer = document.getElementById(error.container_id)

    if(!errorContainer){ errorContainer = fallbackErrorSection }

    if(elementToInvalidate){
      setValidityStateAttributes(elementToInvalidate, false)
    }

    let errorList = getErrorListFromContainer(errorContainer)

    const shouldBePreserved = hasPreservedErrorForType(errorList, error.type)

    const preservedError = getPreservedErrorForType(errorList, error.type)
    preservedError?.remove()

    let listItem = errorMessageListItem(error.message, error.type)

    if(shouldBePreserved) {
      markAsPreservedError(listItem)
    }

    errorList.append(listItem)
    markErrorTypeAsVisible(errorList, error.type)
  }
}