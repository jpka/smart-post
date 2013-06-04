window.expect = chai.expect;
window.should = chai.should();

before(function(done) {
  //this.timeout(3000);
  /*var link = document.createElement("link");
  link.rel = "import";
  link.href = "/base/component.html";
  document.head.appendChild(link);*/
  fixtures.load("../../../base/test/index.html");
  fixtures.window().addEventListener("WebComponentsReady", function() {
    done();
  });
});
