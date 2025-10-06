let timer = 180 * 60; // 180 minutes (3 hours)
let interval;

function startExam() {
  interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (timer <= 0) {
    clearInterval(interval);
    alert("Time is up! Submitting your exam...");
    submitExam();
  }
  const min = Math.floor(timer / 60);
  const sec = timer % 60;
  document.getElementById("timer").textContent = `Time Left: ${min}:${sec < 10 ? "0" + sec : sec}`;
  timer--;
}

function clearResponse() {
  document.querySelectorAll('input[name="option"]').forEach(el => el.checked = false);
}

function saveAndNext() {
  alert("Response saved. Proceeding to next question...");
}

function submitExam() {
  alert("Exam submitted successfully!");
}
