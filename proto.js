module.exports = {
  fixed: false,
  editable: false,
  softUpdates: false,

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
    var self = this,
    fn = "modelAttributeChanged";

    Object.keys(this._model).forEach(function(key) {
      var observer = new PathObserver(self._model, key, function(inNew, inOld) {
        if (inNew === inOld) return;
        self[fn](key, inOld);
      });
      //Polymer.registerObserver(self, "property", key, observer);
      self[fn](key);
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
  update: function() {
    this.updateTitle();
    this.parseBody();
    this.$.update.hidden = true;
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
  modelAttributeChanged: function(key, old) {
    if (!this._ready) return;
    this.$.save.hidden = !this.onEditMode || !old || !this.model[key] || this.model[key] === "";
    if (this.onEditMode) return;

    if (old && this.softUpdates) {
      this.$.update.hidden = false;
      return;
    }
    if (this.style.display === "none" || !old) {
      this.dispatchEvent(new CustomEvent("foreign:update:" + key));
    } else {
      this.$[key].classList.add("preAnimation");
    }
  },
  animationEnded: function(e) {
    if (e.target.classList.contains("preAnimation")) {
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
      e.target.classList.add("postAnimation");
      e.target.classList.remove("preAnimation");
    }
  },
  remove: function() {
    if (!this.parentNode) return;
    this.fire("delete");
    this.parentNode.removeChild(this);
  },
  save: function() {
    this.$.save.hidden = true;
    this.fire("save");
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