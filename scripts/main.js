function runApp() {
  var controller = new AppController();
  controller.setUp();

  $(document).on("click", "#game-container td", analyzeClick.bind(controller));
  $(document).on("click", "#game-container button#reset", resetGame);
}

function analyzeClick(event) {
  this.clickSq(parseInt(event.target.id, 10));
}

function resetGame() {
  this.$table = $("#game-container table").empty();
  $(document).off("click", "#game-container td");
  $(document).off("click", "#game-container button#reset", resetGame);
  runApp();
}

$(document).ready(runApp);
