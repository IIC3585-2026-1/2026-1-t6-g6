const templateSliderLabel = document.createElement("template");
templateSliderLabel.innerHTML = `
  <style>
    :host {
      position: absolute;
      left: var(--slider-label-left, 0%);
      top: 0;
      transform: translateX(-50%);
      color: var(--slider-label-color, #6c5f6b);
      font: 600 12px/1 sans-serif;
      white-space: nowrap;
      user-select: none;
    }

    :host(:first-child) {
      transform: translateX(0);
    }

    :host(:last-child) {
      transform: translateX(-100%);
    }
  </style>

  <slot></slot>
`;

class MiSliderLabel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateSliderLabel.content.cloneNode(true));
  }
}

customElements.define("mi-slider-label", MiSliderLabel);

const templateSlider = document.createElement("template");
templateSlider.innerHTML = `
  <style>
    :host {
      --slider-accent: #ffc6fc;
      --slider-accent-strong: #e57edf;
      --slider-track: #e8dde6;
      --slider-text: #2d2730;

      display: block;
      width: 100%;
      min-width: 180px;
      color: var(--slider-text);
      font-family: sans-serif;
    }

    .slider {
      display: grid;
      gap: 12px;
      width: 100%;
    }

    .value-row {
      display: flex;
      justify-content: flex-end;
      min-height: 22px;
    }

    output {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 22px;
      border-radius: 999px;
      padding: 0 10px;
      background-color: #fff7fd;
      color: var(--slider-text);
      font: 700 12px/1 sans-serif;
      box-sizing: border-box;
    }

    input {
      width: 100%;
      margin: 0;
      cursor: pointer;
      accent-color: var(--slider-accent-strong);
    }

    input[type="range"] {
      appearance: none;
      height: 22px;
      background: transparent;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 999px;
      background:
        linear-gradient(
          to right,
          var(--slider-accent-strong) 0%,
          var(--slider-accent-strong) var(--slider-progress, 0%),
          var(--slider-track) var(--slider-progress, 0%),
          var(--slider-track) 100%
        );
    }

    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      margin-top: -6px;
      border: 3px solid #ffffff;
      border-radius: 50%;
      background-color: var(--slider-accent-strong);
      box-shadow: 0 2px 8px rgba(91, 54, 88, 0.28);
    }

    input[type="range"]::-moz-range-track {
      height: 8px;
      border-radius: 999px;
      background-color: var(--slider-track);
    }

    input[type="range"]::-moz-range-progress {
      height: 8px;
      border-radius: 999px;
      background-color: var(--slider-accent-strong);
    }

    input[type="range"]::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border: 3px solid #ffffff;
      border-radius: 50%;
      background-color: var(--slider-accent-strong);
      box-shadow: 0 2px 8px rgba(91, 54, 88, 0.28);
    }

    input:focus-visible {
      outline: 2px solid var(--slider-accent-strong);
      outline-offset: 5px;
      border-radius: 999px;
    }

    .labels {
      position: relative;
      min-height: 18px;
      margin-top: -4px;
    }
  </style>

  <div class="slider">
    <div class="value-row">
      <output id="current-value"></output>
    </div>
    <input id="range-input" type="range" />
    <div class="labels">
      <slot></slot>
    </div>
  </div>
`;

class MiSlider extends HTMLElement {
  static get observedAttributes() {
    return ["min", "max", "value", "step"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateSlider.content.cloneNode(true));

    this.input = this.shadowRoot.querySelector("#range-input");
    this.output = this.shadowRoot.querySelector("#current-value");
    this.labelSlot = this.shadowRoot.querySelector("slot");

    this.handleInput = this.handleInput.bind(this);
    this.updateLabels = this.updateLabels.bind(this);
  }

  connectedCallback() {
    this.syncAttributesToInput();
    this.updateOutput();
    this.updateProgress();
    this.updateLabels();

    this.input.addEventListener("input", this.handleInput);
    this.labelSlot.addEventListener("slotchange", this.updateLabels);
  }

  disconnectedCallback() {
    this.input.removeEventListener("input", this.handleInput);
    this.labelSlot.removeEventListener("slotchange", this.updateLabels);
  }

  attributeChangedCallback() {
    if (!this.input) {
      return;
    }

    this.syncAttributesToInput();
    this.updateOutput();
    this.updateProgress();
    this.updateLabels();
  }

  get value() {
    return this.input.value;
  }

  set value(newValue) {
    this.setAttribute("value", newValue);
  }

  syncAttributesToInput() {
    const defaults = {
      min: "0",
      max: "100",
      value: "0",
      step: "1",
    };

    Object.entries(defaults).forEach(([attributeName, fallback]) => {
      this.input.setAttribute(
        attributeName,
        this.getAttribute(attributeName) ?? fallback,
      );
    });
  }

  handleInput() {
    this.setAttribute("value", this.input.value);
    this.updateOutput();
    this.updateProgress();
    this.dispatchEvent(
      new Event("input", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  updateOutput() {
    this.output.value = this.input.value;
    this.output.textContent = this.input.value;
  }

  updateProgress() {
    const min = Number(this.input.min);
    const max = Number(this.input.max);
    const value = Number(this.input.value);
    const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;
    const clampedProgress = Math.min(100, Math.max(0, progress));

    this.input.style.setProperty("--slider-progress", `${clampedProgress}%`);
  }

  updateLabels() {
    const min = Number(this.input.min);
    const max = Number(this.input.max);
    const labels = this.querySelectorAll("mi-slider-label");

    labels.forEach((label) => {
      const position = Number(label.getAttribute("position") ?? min);
      const percentage = max === min ? 0 : ((position - min) / (max - min)) * 100;
      const clampedPercentage = Math.min(100, Math.max(0, percentage));

      label.style.setProperty("--slider-label-left", `${clampedPercentage}%`);
    });
  }
}

customElements.define("mi-slider", MiSlider);
