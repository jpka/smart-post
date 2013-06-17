describe("smart-post", function() {  
  var element,
  model = {body: "#title\nsome text"};

  beforeEach(function() {
    element = fixtures.window().document.createElement("smart-post");
    element.model = model;
  });

  it("contains a body", function() {
    expect(element.$.body).to.exist;
  });

  it("contains a hidden editable body", function() {
    expect(element.$.editableBody).to.exist;
    expect(element.$.editableBody.style.display).to.equal("none");
  });

  it("editable-body has the markdown source and body has the processed html", function() {
    expect(element.$.editableBody.value).to.equal(model.body);
    expect(element.$.body.innerHTML).to.equal(element.parse(model.body));
  });

  describe("save button", function() {
    it("isn't visible at first", function() {
      expect(element.$.save.style.display).to.equal("none");
    });

    it("appears when keyup happens in textarea", function() {
      var keyUp = fixtures.window().document.createEvent("KeyboardEvent");
      keyUp.initEvent("keyup", true, false);
      element.$.editableBody.dispatchEvent(keyUp);
      expect(element.$.save.style.display).to.not.equal("none");
    });

    it("saves to model when is pressed, and disappears", function() {
      var newBody = "#new body",
      click = fixtures.window().document.createEvent("MouseEvents");
      click.initEvent("click", true, false);

      element.$.editableBody.value = newBody;
      element.$.save.dispatchEvent(click);
      expect(element.model.body).to.equal(newBody);
      expect(element.$.save.style.display).to.equal("none");
    });
  });

  it("can be instantiated with model as a JSON string attribute", function() {
    element = fixtures.window().document.querySelector("#post");
    expect(element.model).to.exist.and.to.deep.equal(model);
  });

  describe("on hover", function() {
    var mouseOver;

    beforeEach(function() {
      mouseOver = fixtures.window().document.createEvent("MouseEvents");
      mouseOver.initEvent("mouseover", true, false);
    });

    it("doesn't do anything if the user isn't the owner", function() {
      element.editable = false;
      element.dispatchEvent(mouseOver);

      expect(element.$.body.style.display).to.not.equal("none");
      expect(element.$.editableBody.style.display).to.equal("none");
    });

    it("hides the body and shows the editable body if the user is the owner", function() {
      element.editable = true;
      element.dispatchEvent(mouseOver);

      expect(element.$.body.style.display).to.equal("none");
      expect(element.$.editableBody.style.display).to.not.equal("none");
    });

    it("reverses the situation and processes the markdown when mouse leaves", function() {
      var mouseOut = fixtures.window().document.createEvent("MouseEvents"),
      newBody = "#new body";
      mouseOut.initEvent("mouseout", true, false);

      element.editable = true;
      element.dispatchEvent(mouseOver);
      element.$.editableBody.value = newBody;
      element.dispatchEvent(mouseOut);

      expect(element.$.body.style.display).to.not.equal("none");
      expect(element.$.editableBody.style.display).to.equal("none");
      expect(element.$.body.innerHTML).to.equal(element.parse(newBody));
    });
  });

  describe("remove button", function() {

    it("removes it from the DOM and triggers a remove event", function(done) {
      var click = fixtures.window().document.createEvent("MouseEvents");
      click.initEvent("click", true, false);
      element.editable = true;
      fixtures.window().document.body.appendChild(element);

      expect(element.$.remove.style.display).to.not.equal("none");
      element.addEventListener("remove", function() {
        expect(element.parentNode).to.not.exist;
        done();
      });
      element.$.remove.dispatchEvent(click);
    });

    it("toggles with editable state", function() {
      element.editable = false;
      expect(element.$.remove.style.display).to.equal("none");
      element.editable = true;
      expect(element.$.remove.style.display).to.not.equal("none");
    });
  });
});
