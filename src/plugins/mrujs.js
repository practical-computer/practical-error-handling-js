import {applyErrorMappingToFormFromEntityResponseResponse} from '../request-processing.js'

export async function unprocessableEntityResponseHandler(event) {
  await applyErrorMappingToFormFromEntityResponseResponse(event.detail.element, event.detail.response)
}