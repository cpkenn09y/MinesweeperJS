var Mine = function() {
  this.x = null;
  this.y = null;
  this.id = null;
  this.type = "mine";
  this.status = null;
  this.rawHTML = null;
};

var prototype = (function() {

  return {
    setUp: function() {
      this.rawHTML = '<td id="' + this.id + '" class="mine"><i class="fa"></i></td>';
    }
  };

})();

Mine.prototype = prototype;
