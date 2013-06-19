module.exports = {
  ready: function() {
    this._ready = true;
    this.parseBody();
  },

  set editable(flag) {
    this._editable = flag;
    this.updateRemoveButton();
  },
  get editable() {
    return this._editable || null;
  },

  set fixed(flag) {
    this._fixed = flag;
    this.updateRemoveButton();
  },
  get fixed() {
    return this._fixed || null;
  },

  set model(model) {
    if (typeof model === "string") {
      model = JSON.parse(model);
    }
    this._model = model;
    this.observeModel();
  },
  get model() {
    if (!this._model) {
      this.model = {
        body: ""
      };
    }
    return this._model;
  },

  updateRemoveButton: function() {
    this.$.remove.style.display = this.editable && !this.fixed ? "block" : "none";
  },
  observeModel: function() {
    var key, observer;

    for (key in this.model) {
      observer = new PathObserver(this.model, key, function(inNew, inOld) {
        if (inNew === inOld) return;
        this[key + "Changed"](inOld);
      }.bind(this));
      Polymer.registerObserver(this, "property", key, observer);
      this[key + "Changed"]();
    }
  },
  parse: require("marked"),
  editModeOn: function() {
    if (!this.editable) return;
    this.$.editableBody.style.display = "block"; 
    this.$.editableBody.style.height = (this.$.body.clientHeight - 10) + "px"; 
    this.$.body.style.display = "none"; 
    this.onEditMode = true;
  },
  editModeOff: function() {
    if (!this.onEditMode) return;
    this.$.editableBody.style.display = "none"; 
    this.$.body.style.display = "block"; 
    this.parseBody();
    this.onEditMode = false;
  },
  bodyChanged: function() {
    if (!this._ready) return;
    if (!this.onEditMode) {
      this.parseBody();
    }
    this.$.save.style.display = this.model.body && this.model.body !== "" ? "block" : "none";
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
    this.$.save.style.display = "none";
    this.fire("save");
  }
};
