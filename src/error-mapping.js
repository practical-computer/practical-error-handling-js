import { getErrorContainer } from './element-utilities.js'
import { clearErrorListsInForm, errorMessageListItem } from './rendering.js'

example = [
  {
    container_id: "name-field-errors",
    element_to_invalidate_id: "name-field",
    message: "Cannot be blank.",
    type: "valueMissing"
  },
  {
    container_id: "name-field-errors",
    element_to_invalidate_id: "name-field",
    message: "Cannot be blank.",
    type: "server_side_type"
  }
]

export function applyErrorMappingToForm(form, errors) {
  clearErrorListsInForm(form)

  const fallbackErrorSection = getErrorContainer(form)

  for(const error of errors) {
    var elementToInvalidate = document.getElementById(error.element_to_invalidate_id)

    var errorContainer = document.getElementById(error.container_id)
    if(!errorContainer){ errorContainer = fallbackErrorSection }


    if(elementToInvalidate){
      elementToInvalidate.toggleAttribute(`data-is-invalid`, true)
    }

    let errorList = errorContainer.querySelector(`:scope > ul`)
    let listItem = errorMessageListItem(error.message, error.type)

    errorList.append(listItem)
  }
}