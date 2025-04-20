import {
  hasErrorContainer,
  getErrorList,
  hasPreservedErrorForType,
} from '../error-containers.js'

import {
  errorMessageListItem,
  clearErrorList,
  markErrorTypeAsVisible,
} from '../rendering.js'


/**
 * calls {@link clearErrorList } for the given `fieldset`.

 * @param {FieldsetElement} fieldset
 */
export function clearErrorListForFieldset(fieldset) {
  if(!hasErrorContainer(fieldset)){ return }

  const errorListElement = getErrorList(fieldset)

  clearErrorList(errorListElement)
}

/**
 * Renders the given custom message + type pair for the given fieldset
 * calls {@link clearErrorList } for the given `fieldset`
 *
 * replaces the error list to include that message (marked as `data-visible`) and any `preserved` errors
 *
 * @param {FieldsetElement} fieldset
 */
export function renderCustomErrorMessageForFieldset(fieldset, message, type) {
  clearErrorListForFieldset(fieldset)

  const errorListElement = getErrorList(fieldset)

  if(!hasPreservedErrorForType(errorListElement, type)){
    let listItem = errorMessageListItem(message, type)
    errorListElement.append(listItem)
  }

  markErrorTypeAsVisible(errorListElement, type)
}
