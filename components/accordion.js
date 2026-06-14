const itemTemplate = document.createElement("template");
itemTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      border-bottom: 1px solid #e0e0e0;
      font-family: sans-serif;
    }
    
    :host(:last-child) {
      border-bottom: none;
    }

    .header-btn {
      width: 100%;
      text-align: left;
      padding: 15px;
      font-size: 16px;
      font-weight: 600;
      background-color: #FFF7FD;
      border: none;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background-color 0.2s;
    }

    .header-btn:hover {
      background-color: #FFEDFE;
    }

    .header-btn::after {
      content: url('./assets/chevron-down.svg');
      display: inline-block;
      transition: transform 0.3s ease;
    }

    :host([open]) .header-btn::after {
      transform: rotate(180deg);
    }

    .content-wrapper {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
      background-color: #ffffff;
    }

    :host([open]) .content-wrapper {
      max-height: 500px;
    }

    .content-inner {
      padding: 15px;
      color: #333;
    }
  </style>

  <button class="header-btn">
    <slot name="heading"></slot>
  </button>
  
  <div class="content-wrapper">
    <div class="content-inner">
      <slot></slot>
    </div>
  </div>
`;

class AccordionItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(itemTemplate.content.cloneNode(true));
    this.headerBtn = this.shadowRoot.querySelector(".header-btn");
  }

  connectedCallback() {
    this.headerBtn.addEventListener("click", () => this.toggle());
  }

  disconnectedCallback() {
    this.headerBtn.removeEventListener("click", () => this.toggle());
  }

  toggle() {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
    } else {
      this.setAttribute("open", "");
    }
  }
}
customElements.define("web-accordion-item", AccordionItem);

const accordionTemplate = document.createElement("template");
accordionTemplate.innerHTML = `
  <style>
    :host {
      display: block;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden; 
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  </style>
  
  <slot></slot>
`;

class Accordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(accordionTemplate.content.cloneNode(true));
  }
}
customElements.define("web-accordion", Accordion);
