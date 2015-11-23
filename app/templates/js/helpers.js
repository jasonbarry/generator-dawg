/**
   * Alias for document.querySelector
   * @param {string} qs The query selector.
   * @return {HTMLElement} The matching HTML element.
   */
export function $ (qs) {
	return document.querySelector(qs);
}

/**
   * Alias for document.querySelectorAll
   * @param {string} qs The query selector.
   * @return {NodeList} A NodeList of the matching HTML elements.
   */
export function $$ (qs) {
	return document.querySelectorAll(qs);
}

HTMLElement.prototype.$ = HTMLElement.prototype.querySelector;
HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
NodeList.prototype.forEach = Array.prototype.forEach;