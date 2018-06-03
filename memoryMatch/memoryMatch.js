//Ordered by frequency and verbosity: 
//1=basic flow and logic
//2=event processing
//3=timer increments
var debugLevel = 0; 
var timer = 0;
var timerLabel = null;
var timerInterval = null;
var gameStarted = null;
var firstSelectedCell = null;
var matchCount = 0;

init();

function generateRandomAnswers() {
  if (debugLevel > 0) { 
    console.log("enter function: generateRandomAnswers");
  }

  var answers = [1,1,2,2,3,3,4,4,5];
  if (debugLevel > 0) { 
    console.log("answers before: ", answers);
  }

  answers.sort(function(item) {
    //the compare function must return negative, zero or positive number
    //Math.random returns a number between 0 and 1.  Substract 0.5 to ensure 
    //some numbers are negative. 
    return 0.5 - Math.random(); 
  })
  
  if (debugLevel > 0) { 
    console.log("answers after: ", answers);
  }

  if (debugLevel > 0) {
    console.log("exit function: generateRandomAnswers");
  }
  return answers;
}

function restart() { 
  if (debugLevel > 0) { 
    console.log("enter funtion: restart");
  }

  gameStarted = false;
  firstSelectedCell = null;
  timer = 0;
  timerLabel = null;
  matchCount = 0;
  if (debugLevel > 0) { 
    console.log("clearing interval ", timerInterval);
  }
  clearInterval(timerInterval);
  document.getElementById("timer").innerHTML = "";

  initCells(false);
  
  if (debugLevel > 0) { 
    console.log("exit function: restart");
  }
}

function init() {
  if (debugLevel > 0) { 
    console.log("enter function: init");
  }

  var debugField = document.getElementById("debug");

  debugField.addEventListener("change", function(event) { 
    debugLevel = debugField.selectedIndex;
    if (debugLevel > 0) {
      console.log("user hit changed debugLevel to ", debugLevel);
    }

    iterateCells(function(i, cell) { 
      setCellDisplayValue(cell, (debugLevel > 0));
    });

  });

  initCells(true);

  var restartField = document.getElementById("restart");
  restartField.addEventListener("click", restart);

  if (debugLevel > 0) { 
    console.log("exit function: init");
  }
}

function iterateCells(action) { 
  var cells = document.getElementsByTagName("td");
  if (debugLevel > 1) {
    console.log("cells: ", cells);
    console.log("cell count: ", cells.length);
  }

  for (i=0; i<cells.length; i++) {
    if (debugLevel > 1) { 
      console.log("in cell: ",i);
    }
    action(i, cells[i]);
  }
}

function initCells(attachListeners) { 
  var answers = generateRandomAnswers();
  var cells = document.getElementsByTagName("td");
  if (debugLevel > 1) {
    console.log("cells: ", cells);
    console.log("cell count: ", cells.length);
  }

  iterateCells(function(i, cell) {
    cell.value = answers[i];
    hideCell(cell);

    if (attachListeners==true) {
      cell.addEventListener("mouseenter", mouseEnter);
      cell.addEventListener("mouseleave", mouseLeave);
      cell.addEventListener("click", mouseClick);
    } 
  });
}

function hideCell(element) { 
  element.style.background = "blue";
  element.completed = false;
  element.clicked = false;
  setCellDisplayValue(element, false);
}

function mouseEnter(event) { 
  if (debugLevel > 1) { 
    console.log("enter function: mouseEnter");
  }
  
  if (this.clicked || this.completed) { 
    if (debugLevel > 1) { 
      console.log("ignoring mouseenter event"); 
      console.log("exit function: mouseEnter");
    }
    return;
  }

  this.style.background = "orange";
  if (debugLevel > 1) { 
    console.log("exit function: mouseEnter");
  }
}

function mouseLeave(event) { 
  if (debugLevel > 1) { 
    console.log("enter function: mouseLeave");
  }

  if (this.clicked || this.completed) { 
    if (debugLevel > 1) { 
      console.log("ignoring mouseleave event"); 
      console.log("exit function: mouseLeave");
    }
    return;
  }

  this.style.background = "blue";
  if (debugLevel > 1) { 
    console.log("exit function: mouseLeave");
  }
}

function mouseClick(event) { 
  if (debugLevel > 1) { 
    console.log("enter function: mouseClick");
  }

  if (event.target.completed || event.target.clicked) {
    if (debugLevel > 1) { 
      console.log("ignoring mouseClick event");
      console.log("exit function: mouseClick");
    }
    return;
  }

  event.target.clicked = true;

  if (gameStarted == false) {
    gameStarted = true;
    timerInterval = setInterval(timerCallback, 1000);
    if (debugLevel > 0) { 
      console.log("timerInterval ", timerInterval);
    }
  }

  processGuess(event.target);

  if (debugLevel > 1) { 
    console.log("exit function: mouseClick");
  }
}

function revealCell(element) { 
  element.style.background = "red";
  setCellDisplayValue(element, true);
}

function completeCell(element) { 
  element.style.background = "purple";
  element.completed = true;
  setCellDisplayValue(element, true);
}

function matchFound(firstCell, secondCell) { 
  completeCell(firstCell);
  completeCell(secondCell);
  matchCount++;
  if (debugLevel > 0) { 
    console.log("matchCount=",matchCount);
  }

  if (matchCount >= 4) { 
    gameOver();
  }
}

function matchNotFound(firstCell, secondCell) { 
  //flash table border and reveal second cell  
  var table = document.getElementById("table");
  table.style.borderColor  = "red";
  revealCell(secondCell);

  //hide everything after 1/2 second 
  setTimeout(function() { 
    table.style.borderColor  = "black";
    hideCell(firstCell); 
    hideCell(secondCell);
  }, 500);
}

function gameOver() {
  if (debugLevel > 0) { 
    console.log("game over in ", timerLabel);
  }

  window.alert("You won! It took you " + timerLabel);
  restart();
}

function processGuess(element) { 
  //first choice 
  if (firstSelectedCell == null) { 
    firstSelectedCell = element;
    revealCell(element);
  }
  //second choice
  else { 
    if (firstSelectedCell.value == element.value) { 
      matchFound(firstSelectedCell, element);       
    }
    else {
      matchNotFound(firstSelectedCell, element);
    }

    firstSelectedCell = null;
  }
}

function setCellDisplayValue(element, visible) { 
  if (visible) { 
    element.innerHTML = element.value;
  }
  else { 
    element.innerHTML = "";
  }
}

function timerCallback() { 
  timer++;
  if (timer==1) { 
    timerLabel = "1 second";
  }
  else { 
    timerLabel = timer + " seconds";
  }

  document.getElementById("timer").innerHTML = timerLabel;

  if (debugLevel > 2) { 
    console.log("timer now ", timer);
  }
}

