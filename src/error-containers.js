import { generateValidationMessage } from './element-utilities.js'


/**
 * Returns the ID for the given `element`'s `aria-describedby` attribute of the element that has a
 * `data-error-container` attribute`
 * @param {Element} element
 * @returns {string|undefined} the `aria-describedby` attribute if present and the element has the `data-error-container` attribute`
 */
export function getErrorContainerID(element) {
  const errorContainerID = element.getAttribute(`aria-describedby`)
  if(!errorContainerID || errorContainerID == ''){ return }

  return errorContainerID.split(" ").find((x) => {
    return document.getElementById(x)?.hasAttribute(`data-error-container`)
  })
}

/**
 * Checks if there is an `element` that matches the ID from the `aria-describedby` attribute of the given `element``
 * @param {Element} element
 * @returns {boolean} The `element` referenced by `aria-describedby``
 */
export function hasErrorContainer(element) {
  return getErrorContainer(element) != null
}

/**
 * Returns the `element` that acts as the error container, as referenced by the `aria-describedby` attribute. See {@link getErrorContainerID}
 * @param {Element} element
 * @returns {Element} The `element` referenced by `aria-describedby`
 */
export function getErrorContainer(element) {
  return document.getElementById(getErrorContainerID(element))
}

/**
 * Returns the `ul` inside of the `element`'s error container (see {@link getErrorContainer })
 * @param {Element} element
 * @returns {Element} The `ul` element inside the error container`
 */
export function getErrorList(element) {
  return getErrorContainer(element).querySelector(`:scope > ul`)
}

/**
 * Returns the `NodeList` of elements inside the given `errorListElement` with `data-preserve`
 * @param {Element} element
 * @returns {NodeList} All elements with the `data-preserve` attribute
 */
export function getPreservedErrors(errorListElement) {
  return errorListElement.querySelectorAll(`:scope > [data-preserve]`)
}

/**
 * Checks the given `errorListElement` for any preserved errors ({@link getPreservedErrors}) where the `data-error-type`
 * matches` `type``
 * @params {Element} {@link getErrorList}
 * @params {string} type the error type
 * @returns {boolean}
 */
export function hasPreservedErrorForType(errorListElement, type) {
  return [...getPreservedErrors(errorListElement)].some((x) => {
    return x.getAttribute(`data-error-type`)?.toString() == type.toString()
  })
}

/**
 * Returns the `element` that has the given `data-error-type` if it's present.
 * @params {Element} {@link getErrorList}
 * @params {string} type the error type
 * @returns {Element|null}
 */
export function getErrorForType(errorListElement, type) {
  return [...errorListElement.querySelectorAll(`[data-error-type]`)].find((x) => {
    return x.getAttribute(`data-error-type`)?.toString() == type.toString()
  })
}

/**
 * Returns the `template` element with the ID `pf-error-list-item-template`.
 * @returns {HTMLTemplateElement} the element with the ID `pf-error-list-item-template`.
 */
export function errorListItemTemplate() {
  return document.getElementById(`pf-error-list-item-template`)
}