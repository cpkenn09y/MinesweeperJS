var AppController = function() {
  this.Mines = [];
  this.Grid = null;
  this.mineIndexes = [];
  this.DEFAULTBOMBCOUNT = 10;
  this.DEFAULTDIMENSIONS = 8;
  this.$table = $("#game-container table");
};

var prototype = (function() {

  function setUpMSObjects(gridBody) {
    assignIDsToMSObjects(gridBody);
    gridBody.forEach(function(msObject) {
      msObject.setUp();
    });
  }

  function getNorth(object) {
    return { x: object.x, y: object.y - 1 };
  }

  function getNorthEast(object) {
    return { x: object.x + 1, y: object.y - 1 };
  }

  function getEast(object) {
    return { x: object.x + 1, y: object.y };
  }

  function getSouthEast(object) {
    return { x: object.x + 1, y: object.y + 1 };
  }

  function getSouth(object) {
    return { x: object.x, y: object.y + 1 };
  }

  function getSouthWest(object) {
    return { x: object.x - 1, y: object.y + 1 };
  }

  function getWest(object) {
    return { x: object.x - 1, y: object.y };
  }

  function getNorthWest(object) {
    return { x: object.x - 1, y: object.y - 1 };
  }

  function isWithinOneUnitRadius(obj1, obj2) {
    var xValuesWithinOneUnit = obj1.x <= obj2.x + 1 && obj1.x >= obj2.x -1;
    var yValuesWithinOneUnit = obj1.y <= obj2.y + 1 && obj1.y >= obj2.y -1;
    return xValuesWithinOneUnit && yValuesWithinOneUnit;
  }

  function isASquare(mineSweeperObj) {
    return mineSweeperObj.type === "square";
  }

  function assignIDsToMSObjects(gridBody) {
    gridBody.forEach(function(msObject, index) {
      msObject.id = index;
    });
  }

  function open(msObject) {
    if (msObject.type === 'square' ) {
      msObject.status = "open";
      addClassOpen(msObject);
      insertMineCountText(msObject);
    }
  }

  function addClassOpen(msObject) {
    $('#game-container td').eq(msObject.id).addClass('open animated flipInX');
  }

  function insertMineCountText(msObject) {
    bombCount = msObject.neighborBombCount;
    if (bombCount > 0) { $('td#' + msObject.id).text(bombCount); }
  }

  function notifyIfGameComplete(gridBody) {
    if (gridBody.filter(function(msObject) { return msObject.status === "closed"; }).length === 0) {
      removeClickListenerFromTable();
      replaceSadButtonWithSmileyFace();
      alert("YOU WIN!");
    }
  }

  function replaceSadButtonWithSmileyFace() {
    $('button#reset').empty().append('<i class="fa fa-smile-o"></i>')
  }

  function removeClickListenerFromTable() {
    $(document).off("click", "#game-container td");
  }

  function showMines(mineIndex) {
    $('table td').eq(mineIndex).find("i").addClass("fa-bomb animated fadeIn");
  }

  return {
    setUp : function() {
      this.createGrid(this.DEFAULTDIMENSIONS, this.DEFAULTDIMENSIONS);
      this.createMines();
      this.placeMinesOnGrid();

      this.assignCoordinatesToMSObjects();
      this.assignNeighborBombCount();

      setUpMSObjects(this.Grid.body);

      this.placeGridOnDOM();
    },

    createGrid : function(columns, rows) {
      this.Grid = new Grid(columns, rows);
    },

    createMines : function() {
      for (var i = 0; i < this.DEFAULTBOMBCOUNT; i++ ) {
        this.Mines.push(new Mine());
      }
    },

    placeMinesOnGrid : function() {
      this.Grid.placeMinesRandomly(this.Mines);
    },

    placeGridOnDOM: function() {
      var squareCounter = 0;
      var str = "";
      while (squareCounter < this.Grid.body.length) {
        str += "<tr>";
        for (var i = 0; i < this.Grid.rows; i++) {
          str += this.Grid.body[squareCounter].rawHTML;
          squareCounter ++;
        }
        str += "</tr>";
      }
      this.$table.append(str);
    },

    assignNeighborBombCount : function() {
      this.storeMineIndexes();
      _.each(this.mineIndexes, this.incrementValidNeighbors.bind(this));
    },

    incrementValidNeighbors : function(mineIndex) {
      var bomb = this.Grid.body[mineIndex];
      var coordinateFunctions = [getNorth, getNorthEast, getEast, getSouthEast, getSouth, getSouthWest, getWest, getNorthWest];

      coordinateFunctions.forEach(function(compassFunc) {
        var msObject;
        neighborCoordinate = compassFunc(bomb);
        var row = this.Grid.twoDBody[neighborCoordinate.y];
        row !== undefined ? msObject = row[neighborCoordinate.x] : msObject = undefined;
        if (msObject !== undefined && isWithinOneUnitRadius(bomb, msObject) && isASquare(msObject)) {
          msObject.neighborBombCount ++;
        }
      }.bind(this));
    },

    assignCoordinatesToMSObjects : function() {
      var index = 0;
      for (var y = 0; y < this.Grid.rows; y++) {
        for (var x = 0; x < this.Grid.cols; x++) {
          this.Grid.body[index].x = x;
          this.Grid.body[index].y = y;
          index++;
        }
      }
    },

    storeMineIndexes : function() {
      for (var i = 0; i < this.Grid.body.length; i++) {
        if (this.Grid.body[i].type === "mine") this.mineIndexes.push(i);
      }
    },

    clickSq : function(chosenIndex) {
      var msObjectToOpen = this.Grid.body[chosenIndex];
      if (msObjectToOpen.type === "mine") {
        this.loseGame();
      } else {
        this.openSquaresBasedOnBombCount(msObjectToOpen);
      }
    },

    openSquaresBasedOnBombCount : function(msObjectToOpen) {
      switch(msObjectToOpen.neighborBombCount) {
        case 0:
          this.openAllWithinOneUnitRadius(msObjectToOpen);
          break;
        case undefined:
          break;
        default:
          this.onlyOpenClickedSquare(msObjectToOpen);
      }
    },

    openAllWithinOneUnitRadius : function(msObjectToOpen) {
      this.Grid.body.forEach(function(checkObj) {
        if (isWithinOneUnitRadius(msObjectToOpen, checkObj)) {
          if (checkObj.neighborBombCount === 0 && checkObj.status !== "open") {
            checkObj.status = "open";
            this.openAllWithinOneUnitRadius(checkObj);
          } else {
            open(checkObj);
          }
        }
        notifyIfGameComplete(this.Grid.body);
      }.bind(this));
    },

    onlyOpenClickedSquare : function(msObjectToOpen) {
      open(msObjectToOpen);
      notifyIfGameComplete(this.Grid.body);
    },

    loseGame : function() {
      removeClickListenerFromTable();
      this.mineIndexes.forEach(showMines);
      alert("The mine explodes! :(");
    }
  };

})();

AppController.prototype = prototype;
