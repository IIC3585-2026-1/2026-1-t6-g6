const templateCard = document.createElement("template");
templateCard.innerHTML = `
  <style>
    :host {
      display: block;
      width: var(--card-width, auto);
      height: var(--card-height, auto);
      box-sizing: border-box;
      background-color: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: var(--radius, 10px);
      padding: 10px;
    }
  </style>
  <slot></slot>
`;

class MyCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateCard.content.cloneNode(true));
  }
}

customElements.define("my-card", MyCard);