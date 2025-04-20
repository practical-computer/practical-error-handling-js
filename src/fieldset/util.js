import {
  skipChangeValidation,
  skipFocusoutValidation,
  skipValidation
} from "../element-utilities.js"

/**
 * Helper method to check if the the `ChangeEvent` is inside of
 * its target.
 *
 * @param {ChangeEvent} event
 * @return {boolean}
 */
export function isChangeEventForTarget(event) {
  return event.currentTarget == event.target
}

/**
 * Helper method to check that the the `FocusEvent` is inside of
 * its target.
 *
 * @param {FocusEvent} event
 * @return {boolean}
 */
export function isFocusEventInsideTarget(event) {
  return event.currentTarget.contains(event.relatedTarget)
}

/**
 * Helper method to check if the `change` event should be skipped by checking:
 * - {@link isChangeEventForTarget}
 * - {@link skipChangeValidation}
 * - {@link skipValidation}
 *
 * @param {Event} event
 * @returns {boolean} true if the `change` event should be skipped
 */
export function skipFieldsetChangeEvent(event) {
  if(isChangeEventForTarget(event)){ return true }

  const element = event.currentTarget
  if(skipChangeValidation(element)){ return true }
  if(skipValidation(element)){ return true }

  return false
}

/**
 * Helper method to check if the `focousout` event should be skipped by checking:
 * - {@link isFocusEventInsideTarget}
 * - {@link skipFocusoutValidation}
 * - {@link skipValidation}
 *
 * @param {Event} event
 * @returns {boolean} true if the `focousout` event should be skipped
 */
export function skipFieldsetFocusoutEvent(event) {
  if(isFocusEventInsideTarget(event)){ return true}

  const element = event.currentTarget
  if(skipFocusoutValidation(element)){ return true }
  if(skipValidation(element)){ return true }

  return false
}