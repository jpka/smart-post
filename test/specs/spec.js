describe("smart-post", function() {  
  var element,
  model = {title: "Title", body: "some text"};

  beforeEach(function(done) {
    element = fixtures.window().document.createElement("smart-post");
    fixtures.window().document.body.appendChild(element);
    element.addEventListener("update", function() {
      done();
    });
    element.model = model;
  });

  it("editable-body has the markdown source and body has the processed html", function() {
    expect(element.$.editableBody.value).to.equal(model.body);
    expect(element.$.body.innerHTML).to.equal(element.parse(model.body));
  });

  describe("save button", function() {
    beforeEach(function() {
      element = fixtures.window().document.createElement("smart-post");
      fixtures.window().document.body.appendChild(element);
      element.editable = true;
    });

    it("isn't visible at first", function() {
      expect(element.$.save.style.display).to.equal("none");
    });

    it("toggles on body change, depending if there is or isn't text", function(done) {
      element.model.body = "algo";
      element.addEventListener("update", function() {
        element.model.body = "algo2";
        element.addEventListener("update", function() {
          expect(element.$.save.style.display).to.not.equal("none");
          element.model.body = "";
          element.addEventListener("update", function() {
            expect(element.$.save.style.display).to.equal("none");
            done();
          });
        });
      });
    });

    it("fires save event when is pressed, and disappears", function(done) {
      var click = fixtures.window().document.createEvent("MouseEvents");
      click.initEvent("click", true, false);
      element.$.save.style.display = "block";

      element.addEventListener("save", function() {
        expect(element.$.save.style.display).to.equal("none");
        done();
      });
      element.$.save.dispatchEvent(click);
    });
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

    it("removes it from the DOM and triggers a delete event", function(done) {
      var click = fixtures.window().document.createEvent("MouseEvents");
      click.initEvent("click", true, false);
      element.editable = true;
      fixtures.window().document.body.appendChild(element);

      expect(element.$.remove.style.display).to.not.equal("none");
      element.addEventListener("delete", function() {
        expect(element.parentNode).to.not.exist;
        done();
      });
      element.$.remove.dispatchEvent(click);
    });

    it("toggles with editable and fixed state", function() {
      element.editable = false;
      element.fixed = false;
      expect(element.$.remove.style.display).to.equal("none");

      element.editable = false;
      element.fixed = true;
      expect(element.$.remove.style.display).to.equal("none");

      element.editable = true;
      element.fixed = false;
      expect(element.$.remove.style.display).to.not.equal("none");

      element.editable = true;
      element.fixed = true;
      expect(element.$.remove.style.display).to.equal("none");
    });
  });

  it("updates when body changes", function(done) {
    element.model.body = "changed";
    setTimeout(function() {
      expect(element.$.body.innerHTML).to.include("changed");
      done();
    }, 1000);
  });
});
