const templateCampoNumerico = document.createElement("template");
templateCampoNumerico.innerHTML = `
  <style>
    :host {
      --campo-border: #d8ccd6;
      --campo-accent: #ffc6fc;
      --campo-accent-hover: #f6a8f1;
      --campo-radius: 8px;
      --campo-text: #2d2730;
      --campo-width: 220px;

      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--campo-text);
      font-family: sans-serif;
    }

    .label {
      font-weight: 700;
    }

    .control {
      display: inline-grid;
      grid-template-columns: minmax(0, 1fr) 34px;
      width: var(--campo-width);
      min-height: 42px;
      border: 1px solid var(--campo-border);
      border-radius: var(--campo-radius);
      overflow: hidden;
      background-color: #ffffff;
      box-sizing: border-box;
    }

    input {
      width: 100%;
      min-width: 0;
      border: 0;
      padding: 0 12px;
      color: inherit;
      font: inherit;
      outline: none;
      box-sizing: border-box;
    }

    input:focus-visible {
      box-shadow: inset 0 0 0 2px var(--campo-accent);
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      margin: 0;
      appearance: none;
    }

    input[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;
    }

    .buttons {
      display: grid;
      grid-template-rows: 1fr 1fr;
      border-left: 1px solid var(--campo-border);
      background-color: #fff7fd;
    }

    button {
      display: grid;
      place-items: center;
      border: 0;
      color: var(--campo-text);
      background-color: transparent;
      font: 700 14px/1 sans-serif;
      cursor: pointer;
    }

    button:first-child {
      border-bottom: 1px solid var(--campo-border);
    }

    button:hover {
      background-color: var(--campo-accent);
    }

    button:active {
      background-color: var(--campo-accent-hover);
    }

    button:focus-visible {
      outline: 2px solid var(--campo-accent-hover);
      outline-offset: -2px;
    }
  </style>

  <span class="label"><slot></slot></span>
  <div class="control">
    <input id="number-input" type="number" />
    <div class="buttons" aria-hidden="false">
      <button id="increase-button" type="button" aria-label="Aumentar">+</button>
      <button id="decrease-button" type="button" aria-label="Disminuir">-</button>
    </div>
  </div>
`;

class CampoNumerico extends HTMLElement {
  static get observedAttributes() {
    return ["value", "min", "max", "step"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateCampoNumerico.content.cloneNode(true));

    this.input = this.shadowRoot.querySelector("#number-input");
    this.increaseButton = this.shadowRoot.querySelector("#increase-button");
    this.decreaseButton = this.shadowRoot.querySelector("#decrease-button");

    this.handleInput = this.handleInput.bind(this);
    this.increase = this.increase.bind(this);
    this.decrease = this.decrease.bind(this);
  }

  connectedCallback() {
    this.syncAttributesToInput();
    this.input.addEventListener("input", this.handleInput);
    this.increaseButton.addEventListener("click", this.increase);
    this.decreaseButton.addEventListener("click", this.decrease);
  }

  disconnectedCallback() {
    this.input.removeEventListener("input", this.handleInput);
    this.increaseButton.removeEventListener("click", this.increase);
    this.decreaseButton.removeEventListener("click", this.decrease);
  }

  attributeChangedCallback() {
    if (this.input) {
      this.syncAttributesToInput();
    }
  }

  get value() {
    return this.input.value;
  }

  set value(newValue) {
    this.setAttribute("value", newValue);
  }

  syncAttributesToInput() {
    const supportedAttributes = ["min", "max", "step"];

    supportedAttributes.forEach((attributeName) => {
      if (this.hasAttribute(attributeName)) {
        this.input.setAttribute(attributeName, this.getAttribute(attributeName));
      } else {
        this.input.removeAttribute(attributeName);
      }
    });

    this.input.value = this.getAttribute("value") ?? "0";
  }

  handleInput() {
    this.setAttribute("value", this.input.value);
    this.dispatchChangeEvents();
  }

  increase() {
    this.input.stepUp();
    this.handleInput();
  }

  decrease() {
    this.input.stepDown();
    this.handleInput();
  }

  dispatchChangeEvents() {
    this.dispatchEvent(
      new Event("input", {
        bubbles: true,
        composed: true,
      }),
    );
    this.dispatchEvent(
      new Event("change", {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("campo-numerico", CampoNumerico);
