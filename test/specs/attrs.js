describe("Attributes", function() {
  function create(str, id, cb) {
    fixtures.window().document.body.innerHTML += str;
    setTimeout(function() {
      cb(fixtures.window().document.querySelector("#" + id));
    }, 1000);
  }

  it("model", function(done) {
    create("<smart-post id='withModel' model='{\"body\": \"stuff\"}'></smart-post>", "withModel", function(el) {
      expect(el.model.body).to.equal("stuff");
      done();
    }, 1000);
  });

  it("editable", function(done) {
    create("<smart-post id='withEditable' editable='true'></smart-post>", "withEditable", function(el) {
      expect(el.editable).to.equal("true");
      expect(el.$.remove.style.display).to.not.equal("none");
      done();
    });
  });

  it("fixed", function(done) {
    create("<smart-post id='withFixed' editable='true' fixed='true'></smart-post>", "withFixed", function(el) {
      expect(el.fixed).to.equal("true");
      expect(el.$.remove.style.display).to.equal("none");
      done();
    });
  });
});
