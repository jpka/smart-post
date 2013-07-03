module.exports = {
  fixed: false,
  editable: false,

  ready: function() {
    var self = this;
    this._ready = true;
    this.$.title.textContent = this.model.title;
    this.shadowRoot.querySelectorAll(".updeatable").forEach(function(elem) {
      elem.addEventListener("webkitAnimationEnd", self.animationEnded.bind(self));
      elem.addEventListener("animationend", self.animationEnded.bind(self));
      elem.addEventListener("update", self.onUpdate.bind(self));
    });
    this.parseBody();
  },

  set model(model) {
    this._model = model;
    this.observeModel();
  },
  get model() {
    if (!this._model) {
      this.model = {
        title: "",
        body: ""
      };
    }
    return this._model;
  },

  observeModel: function() {
    var self = this;

    Object.keys(this._model).forEach(function(key) {
      var fname = key + "Changed",
      observer;

      observer = new PathObserver(self._model, key, function(inNew, inOld) {
        if (inNew === inOld) return;
        if (typeof self[fname] === "function") self[fname](inOld);
      });
      Polymer.registerObserver(self, "property", key, observer);
      if (self[fname]) self[fname]();
    });
  },
  parse: require("./components/marked/index.js"),
  editModeOn: function() {
    if (!this.editable) return;
    this.$.editableBody.style.height = (this.$.body.clientHeight) + "px"; 
    this.onEditMode = true;
  },
  editModeOff: function() {
    if (!this.onEditMode) return;
    this.parseBody();
    this.onEditMode = false;
  },
  updateTitleModel: function() {
    while (this.$.title.firstElementChild) {
      this.$.title.removeChild(this.$.title.firstElementChild);
    }
    this.model.title = this.$.title.textContent;
  },
  updateTitle: function() {
    this.$.title.textContent = this.model.title;
    this.$.title.dispatchEvent(new CustomEvent("update", {bubbles: true}));
  },
  titleChanged: function(old) {
    if (!this._ready) return;
    this.$.save.hidden = !old || !this.model.title || this.model.title === "";
    if (!this.onEditMode) {
      if (this.style.display === "none") {
        this.dispatchEvent(new CustomEvent("foreign:update:title"));
      } else {
        this.$.title.classList.add("preAnimation");
      }
    }
  },
  bodyChanged: function(old) {
    if (!this._ready) return;
    this.$.save.hidden = !old || !this.model.body || this.model.body === "";
    if (!this.onEditMode) {
      if (this.style.display === "none") {
        this.dispatchEvent(new CustomEvent("foreign:update:body"));
      } else {
        this.$.body.classList.add("preAnimation");
      }
    }
  },
  animationEnded: function(e) {
    if (e.target.classList.contains("preAnimation")) {
      e.target.hidden = true;
      this.dispatchEvent(new CustomEvent("foreign:update:" + e.target.id));
    } else {
      e.target.classList.remove("postAnimation");
    }
  },
  parseBody: function() {
    if (!this._ready) return;
    //Just to kickstart it, he's a little shy...
    if (!this.$.editableBody.value) {
      this.$.editableBody.value = this.model.body;
    }
    this.$.body.innerHTML = this.parse(this.$.editableBody.value);
    this.$.body.dispatchEvent(new CustomEvent("update", {bubbles: true}));
  },
  onUpdate: function(e) {
    if (e.target.classList.contains("preAnimation")) {
      e.target.classList.remove("preAnimation");
      e.target.hidden = false;
      e.target.classList.add("postAnimation");
    }
  },
  remove: function() {
    if (!this.parentNode) return;
    this.parentNode.removeChild(this);
    this.dispatchEvent(new CustomEvent("delete"));
  },
  save: function() {
    this.$.save.hidden = true;
    this.dispatchEvent(new CustomEvent("save"));
  },
  keyUp: function(e) {
    switch (e.keyCode) {
      case 13: //ENTER
        this.save();
      case 27: //ESC
        this.editModeOff();
    }
  },
  preventNewLine: function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }
};