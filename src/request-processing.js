import { applyErrorMappingToForm } from './error-mapping.js'

/**
 * Calls {@link applyErrorMappingToForm}, If the given `response` has a `status` of `422`
 * `element` and `response` from the given `event`
 * @param {FormElement} form - The `form` event that triggered the event
 * @param {Response} response - The `Response` from the fetch request
 */
export async function applyErrorMappingFromResponse(form, response) {
  if(response.status != 422){ return }
  const errors = await response.json()
  applyErrorMappingToForm(form, errors)
}