var debugLevel = 0;
var timeInSeconds = 0.0;
var timerInterval = null;
var timerElement = null;
var timerLogElement = null;

init();

function init() {
  timerElement = document.getElementById("timer");
  timerLogElement = document.getElementById("timerLog");

  startButton = document.getElementById("startStop");
  startButton.addEventListener("click", handleStartStop);
  
  resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", handleReset);

  recordButton = document.getElementById("recordTime");
  recordButton.addEventListener("click", handleRecordTime);

  document.addEventListener('keydown', function(event) {
    if (event.key === 's') {
      handleStartStop(event);
    } else if (event.key === 't') {
      handleRecordTime(event);
    } else if (event.key === 'r') {
      handleReset(event);
    }
  });
}

function startTimer() { 
  if (timerInterval!=null) { 
    console.log("start requested but timer already running");
  }
  else { 
    timerInterval = setInterval(function() { 
      timeInSeconds = timeInSeconds + 0.01;
      timerElement.innerHTML = timeInSeconds.toFixed(2);
    }, 10);
  }
}

function stopTimer() { 
  if (timerInterval == null) { 
    console.log("stop requested but timer is not running");
  }
  else { 
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function handleStartStop(event) {
  if (timerInterval==null) {
    startTimer();
  }
  else { 
    stopTimer();
  }
}

function handleReset(event) {
  stopTimer(); 
  timeInSeconds = 0.0;
  timerElement.innerHTML = timeInSeconds.toFixed(2);
  timerLogElement.innerHTML = "";
}

function handleRecordTime(event) {
  if (timerInterval == null) { 
    console.log("record time requested but timer not active");
    var previousInnerHTML = timerLogElement.innerHTML;
    timerLogElement.innerHTML += "Timer not active<br>";
    setTimeout(function() { 
      timerLogElement.innerHTML = previousInnerHTML;
    }, 2000);
  }
  else { 
    timerLogElement.innerHTML += timeInSeconds.toFixed(2) + "<br>";
  }
}
