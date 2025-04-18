export class ErrorHandlingElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if(!this.isConnected){ return }

    console.debug("AA")
  }

  disconnectedCallback(){}
}