import {applyErrorMappingFromResponse} from '../request-processing.js'

/**
 * Calls {@link applyErrorMappingFromResponse}, passing along the
 * `element` and `response` from the given `event`
 * @param {Event} event - The event that was fired for a fetch response, ideally `ajax:response:error`
 * @param {FormElement} event.detail.element - The `form` event that triggered the event
 * @param {Response} event.detail.response - The `Response` from the fetch request
 */
export async function unprocessableEntityResponseHandler(event) {
  await applyErrorMappingFromResponse(event.detail.element, event.detail.response)
}