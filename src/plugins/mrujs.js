import {applyErrorMappingToFormFromEntityResponseResponse} from '../request-processing.js'

export function unprocessableEntityResponseHandler(event) {
  applyErrorMappingToFormFromEntityResponseResponse(event.detail.element, event.detail.response)
}