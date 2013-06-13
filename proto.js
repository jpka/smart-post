module.exports = {
  _model: {},

  ready: function() {
    this.$.editableBody.addEventListener("keyup", this.updateBody.bind(this));
  },

  set model(model) {
    if (typeof model === "string") {
      model = JSON.parse(model);
    }
    this.$.body.innerHTML = this.parse(model.body);
    this.$.editableBody.innerText = model.body;
  
    this._model = model;
  },
  get model() {
    return this._model;
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
  updateBody: function() {
    this.model.body = this.$.editableBody.value;
    this.$.body.innerHTML = this.parse(this.model.body);
  }
};
