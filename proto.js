module.exports = {
  _model: {},

  ready: function() {
    this.$.editableBody.addEventListener("keyup", this.updateBody.bind(this));
    this.$.remove.addEventListener("click", this.remove.bind(this));
  },

  set model(model) {
    if (typeof model === "string") {
      model = JSON.parse(model);
    }
    this._model = model;
    this.parseBody();
    this.$.editableBody.innerText = model.body;
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
    this.onEditMode = false;
  },
  parseBody: function() {
    this.$.body.innerHTML = this._model.body ? this.parse(this._model.body) : "";
  },
  updateBody: function() {
    this.model.body = this.$.editableBody.value;
    this.parseBody();
  },
  remove: function() {
    if (!this.parentNode) return;
    this.parentNode.removeChild(this);
    this.dispatchEvent(new CustomEvent("remove"));
  }
};
