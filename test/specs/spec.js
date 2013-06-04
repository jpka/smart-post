describe("smart-post", function() {  
  var element;

  before(function() {
    element = fixtures.window().document.querySelector("#post");
  });

  it("contains a body", function() {
    expect(element.webkitShadowRoot.querySelector("#body")).to.exist;
  });

  it("can be instantiated with model as an attribute", function() {
    expect(element.model).to.exist.and.to.deep.equal({body: "body"});
  });
});
