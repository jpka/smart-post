describe("smart-post", function() {  
  var element;

  beforeEach(function() {
    element = fixtures.window().document.createElement("jpka-smart-post");
  });

  it("contains a body", function() {
    expect(element.webkitShadowRoot.querySelector("#body")).to.exist;
  });

  it("can get and set the model", function() {
    var model = {a: 1};
    element.model = model;
    expect(element.model).to.deep.equal(model);
  });

  it("updates the body when a model with data is added", function(done) {
    element.model = {body: "Default body"};
    setTimeout(function() {
      expect(element.webkitShadowRoot.querySelector("#body").innerHTML).to.equal("Default body");
      done();
    }, 1000);
  });
});
