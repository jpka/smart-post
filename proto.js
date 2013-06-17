module.exports = {
  _model: {},

  ready: function() {
    var self = this;
    this.$.editableBody.addEventListener("keyup", function() {
      self.$.save.style.display = "block";
    });
    this.$.save.addEventListener("click", this.save.bind(this));
    this.$.remove.addEventListener("click", this.remove.bind(this));
    this.addEventListener("mouseover", this.editModeOn);
    this.addEventListener("mouseout", this.editModeOff);
  },

  set model(model) {
    if (typeof model === "string") {
      model = JSON.parse(model);
    }
    this._model = model;
    this.$.editableBody.value = model.body;
    this.parseBody();
  },
  get model() {
    return this._model;
  },

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

  parse: require("marked"),
  editModeOn: function() {
    if (!this.editable) return;
    this.$.editableBody.style.display = "block"; 
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
  parseBody: function() {
    this.$.body.innerHTML = this.parse(this.$.editableBody.value);
  },
  remove: function() {
    if (!this.parentNode) return;
    this.parentNode.removeChild(this);
    this.dispatchEvent(new CustomEvent("remove"));
  },
  save: function() {
    this._model.body = this.$.editableBody.value;
    this.$.save.style.display = "none";
    this.dispatchEvent(new CustomEvent("save"));
  }
};
