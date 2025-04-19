import { applyErrorMappingToForm } from './error-mapping.js'

export async function applyErrorMappingToFormFromEntityResponseResponse(form, response) {
  if(response.status != 422){ return }
  const errors = await response.json()
  applyErrorMappingToForm(form, errors)
}