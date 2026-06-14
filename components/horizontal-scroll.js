const templateScroll = document.createElement("template");
templateScroll.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }
    .scroll-track {
      display: flex;
      flex-direction: row;
      overflow-x: auto;
      gap: 16px;
      padding: 10px;
    }
    
    ::slotted(*) {
      flex-shrink: 0;
    }
    
    .scroll-track::-webkit-scrollbar {
      height: 6px;
    }
    .scroll-track::-webkit-scrollbar-track {
      margin: 0 15px;
      background-color: transparent;
    }
    .scroll-track::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 4px;
    }
    .scroll-track::-webkit-scrollbar-thumb:hover {
      background-color: #aaa;
    }
  </style>

  <div class="scroll-track">
    <slot></slot>
  </div>
`;

class HorizontalScroll extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateScroll.content.cloneNode(true));
  }
}

customElements.define("web-horizontal-scroll", HorizontalScroll);
