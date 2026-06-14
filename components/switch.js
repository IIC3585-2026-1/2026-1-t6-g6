const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: sans-serif;
    }

    .switch-container {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .switch-container input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #ffc6fc;
    }
    input:checked + .slider:before {
      transform: translateX(20px);
    }

    .message-on { display: none; }
    .message-off { display: inline; }

    :host([checked]) .message-on { display: inline; }
    :host([checked]) .message-off { display: none; }
  </style>

  <slot></slot>

  <label class="switch-container">
    <input type="checkbox" id="checkbox">
    <span class="slider"></span>
  </label>

  <span class="message-on"><slot name="checked-message"></slot></span>
  <span class="message-off"><slot name="unchecked-message"></slot></span>
`;

class Switch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.checkbox = this.shadowRoot.querySelector("#checkbox");
  }

  connectedCallback() {
    this.checkbox.addEventListener("change", () => this.toggleState());
  }

  disconnectedCallback() {
    this.checkbox.removeEventListener("change", () => this.toggleState());
  }

  toggleState() {
    if (this.checkbox.checked) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }
}

customElements.define("web-switch", Switch);
