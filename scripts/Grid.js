var Grid = function(columns, rows) {
  this.cols = columns;
  this.rows = rows;
  this.body = [];
  this.twoDBody = [];
  this.createBody();
};

var prototype = {
  createBody : function() {
    for (var i = 0; i < (this.cols * this.rows); i++) {
      this.body.push(new Square());
    }
  },
  createTwoDBody : function() {
    var index = 0;

    for (var i = 0; i < this.rows; i++) {
      var row = [];
      for (var col = 0; col < this.cols; col++) {
        row.push(this.body[index]);
        index++;
      }
      this.twoDBody.push(row);
    }
  },
  placeMinesRandomly : function(mines) {
    var mineIndexes = _.sample(_.range(this.body.length), mines.length);
    for (var i = 0; i < mineIndexes.length; i++) {
      this.body[mineIndexes[i]] = mines[i];
    }
    this.createTwoDBody();
  }
};

Grid.prototype = prototype;
