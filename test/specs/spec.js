describe("smart-post", function() {  
  var element;

  beforeEach(function() {
    element = fixtures.window().document.createElement("smart-post");
    element.model = {body: "#body"};
  });

  it("contains a body", function() {
    expect(element.$.body).to.exist;
  });

  it("contains a hidden editable body", function() {
    expect(element.$.editableBody).to.exist;
    expect(element.$.editableBody.style.display).to.equal("none");
  });

  it("editable-body has the markdown source and body has the processed html", function() {
    expect(element.$.editableBody.value).to.equal("#body");
    expect(element.$.body.innerHTML).to.contain("<h1");
  });

  it("editable-body updates model when changed and body renders with new markdown source", function() {
    var newBody = "#new body",
    keyPress = document.createEvent("KeyboardEvent");
    keyPress.initEvent("keyup", true, false);

    element.$.editableBody.innerText = newBody;
    element.$.editableBody.style.display = "block";
    element.$.editableBody.dispatchEvent(keyPress);

    expect(element.model.body).to.equal(newBody);
    expect(element.$.body.innerHTML).to.equal(element.parse(newBody));
  });

  it("can be instantiated with model as an attribute", function() {
    element = fixtures.window().document.querySelector("#post");
    expect(element.model).to.exist.and.to.deep.equal({body: "#body"});
  });

  describe("on hover", function() {
    var mouseOver = document.createEvent("MouseEvents");
    mouseOver.initEvent("mouseover", true, false);

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
      var mouseOut = document.createEvent("MouseEvents");

      mouseOut.initEvent("mouseout", true, false);
      element.editable = true;
      element.dispatchEvent(mouseOver);
      element.dispatchEvent(mouseOut);

      expect(element.$.body.style.display).to.not.equal("none");
      expect(element.$.editableBody.style.display).to.equal("none");
    });
  });

  it("has a remove button on it's corner that removes it from the DOM and triggers a remove event", function(done) {
    var click = document.createEvent("MouseEvents");
    click.initEvent("click", true, false);
    document.body.appendChild(element);

    expect(element.$.remove).to.exist;
    element.addEventListener("remove", function() {
      expect(element.parentNode).to.not.exist;
      done();
    });
    element.$.remove.dispatchEvent(click);
  });
});
