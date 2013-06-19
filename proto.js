module.exports = {
  set editable(flag) {
    if (flag) {
      this.$.remove.style.display = "block";
    } else {
      this.$.remove.style.display = "none";
    }
    this._editable = flag;
  },
  get editable() {
    return this._editable;
  },

  _model: {
    body: ""
  },
  set model(model) {
    if (typeof model === "string") {
      model = JSON.parse(model);
    }
    //Just to kickstart it, he's a little shy...
    this.$.editableBody.value = model.body;
    this._model = model;
    this.parseBody();
  },
  get model() {
    return this._model;
  },

  showSaveButton: function() {
    this.$.save.style.display = "block";
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
  modelChanged: function() {
    if (!this.onEditMode) {
      this.parseBody();
    }
  },
  parseBody: function() {
    this.$.body.innerHTML = this.parse(this.$.editableBody.value);
    this.send("update");
  },
  remove: function() {
    if (!this.parentNode) return;
    this.parentNode.removeChild(this);
    this.send("remove");
  },
  save: function() {
    this.$.save.style.display = "none";
    this.send("save");
  }
};
