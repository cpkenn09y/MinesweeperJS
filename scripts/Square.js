var Square = function() {
  this.x = null;
  this.y = null;
  this.id = null;
  this.neighborBombCount = 0;
  this.type = "square";
  this.status = "closed";
  this.rawHTML = null;
  this.colors = { 1 : "blue", 2 : "green", 3 : "red", 4 : "pink", 5: "orange" };
};

var prototype = (function() {

  return {
    setUp: function() {
      this.rawHTML = '<td id="' + this.id + '" class="' + this.colors[this.neighborBombCount] + '"></td>';
    }
  };

})();

Square.prototype = prototype;
