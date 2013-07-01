Polymer.register(this, {
  fixed: false,
  editable: false,

  ready: function() {
    var self = this;
    this._ready = true;
    this.$.title.textContent = this.model.title;
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
  parse: require("marked"),
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
  },
  titleChanged: function(old) {
    if (!this._ready) return;
    this.$.save.hidden = !old || !this.model.title || this.model.title === "";
    if (!this.onEditMode) {
      if (this.style.display === "none") {
        this.dispatchEvent(new CustomEvent("foreign:update:title"));
      } else {
        this.$.title.style.opacity = 0;
      }
    }
  },
  titleTransitionEnded: function() {
    if (this.$.title.style.opacity > 0) return;
    this.dispatchEvent(new CustomEvent("foreign:update:title"));
    this.$.title.style.opacity = 1;
  },
  bodyChanged: function(old) {
    if (!this._ready) return;
    this.$.save.hidden = !old || !this.model.body || this.model.body === "";
    if (!this.onEditMode) {
      if (this.style.display === "none") {
        this.dispatchEvent(new CustomEvent("foreign:update:body"));
      } else {
        this.$.body.style.opacity = 0;
      }
    }
  },
  bodyTransitionEnded: function() {
    if (this.$.body.style.opacity > 0) return;
    this.dispatchEvent(new CustomEvent("foreign:update:body"));
    this.$.body.style.opacity = 1;
  },
  parseBody: function() {
    if (!this._ready) return;
    //Just to kickstart it, he's a little shy...
    if (!this.$.editableBody.value) {
      this.$.editableBody.value = this.model.body;
    }
    this.$.body.innerHTML = this.parse(this.$.editableBody.value);
    this.fire("update");
  },
  remove: function() {
    if (!this.parentNode) return;
    this.parentNode.removeChild(this);
    this.fire("delete");
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
});