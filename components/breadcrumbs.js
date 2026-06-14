const itemTemplate = document.createElement("template");
itemTemplate.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      font-family: sans-serif;
      font-size: 14px;
    }

    a {
      text-decoration: none;
      color: #8b7588;
      font-weight: 700;
      cursor: default;
    }

    :host([href]) a {
      color: #b8abb6;
      font-weight: 400;
      cursor: pointer;
    }
    
    :host([href]) a:hover {
      text-decoration: underline;
    }

    :host(:not(:last-child))::after {
      content: url('./assets/chevron-left.svg'); 
      margin: 0.25rem 0.5rem 0 0.5rem;
      display: inline-flex;
      align-items: center;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  </style>

  <a id="inner-link"><slot></slot></a>
`;

class BreadcrumbsItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(itemTemplate.content.cloneNode(true));
    this.innerLink = this.shadowRoot.querySelector("#inner-link");
  }

  connectedCallback() {
    if (this.hasAttribute("href")) {
      this.innerLink.setAttribute("href", this.getAttribute("href"));
    }
  }
}
customElements.define("web-breadcrumbs-item", BreadcrumbsItem);

const breadcrumbTemplate = document.createElement("template");
breadcrumbTemplate.innerHTML = `
  <style>
    :host {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.625rem 1rem;
      border-radius: 4px;
    }
  </style>
  <slot></slot> `;

class Breadcrumbs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(breadcrumbTemplate.content.cloneNode(true));
  }
}
customElements.define("web-breadcrumbs", Breadcrumbs);
