let allQuestions = [];
let current = 0;
let score = 0;
let totalQuestions = 0;
let userAnswers = {};

// Fetch all questions, flatten categories
async function loadQuestions() {
  try {
    const res = await fetch("questions.json");
    const data = await res.json();
    allQuestions = [
      ...data["Algorithms"],
      ...data["Operating Systems"],
      ...data["DBMS"],
      ...data["Computer Networks"]
    ];
    totalQuestions = allQuestions.length;
    generateQuestionButtons();
    showQuestion();
    startTimer(30 * 60); // 30 minutes in seconds
  } catch (err) {
    document.getElementById("question-box").innerHTML =
      "<p>Error loading questions. Please check your file and server.</p>";
    console.error(err);
  }
}

// Display current question and options
function showQuestion() {
  const q = allQuestions[current];
  const box = document.getElementById("question-box");
  box.innerHTML = `
    <h3>Question ${current + 1} of ${totalQuestions}</h3>
    <p>${q.question_text}</p>
    <div class="options">
      ${Object.entries(q.options)
        .map(
          ([key, val]) =>
            `<label><input type="radio" name="option" value="${key}" ${
              userAnswers[current] === key ? "checked" : ""
            }> ${key}. ${val}</label>`
        )
        .join("")}
    </div>
  `;
  updateActiveButton();
}

// Save answer and proceed
function submitAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  const btn = document.getElementById(`qbtn-${current}`);

  if (!selected) {
    // Mark unanswered, go next
    btn.classList.remove("answered");
    btn.classList.add("unanswered");
    userAnswers[current] = null;
    nextQuestion();
    return;
  }

  const chosen = selected.value;
  const correct = allQuestions[current].correct_option;

  if (!(current in userAnswers)) {
    if (chosen === correct) score += allQuestions[current].marks;
    else score += allQuestions[current].negative_marks;
  }

  userAnswers[current] = chosen;
  btn.classList.remove("unanswered");
  btn.classList.add("answered");
  nextQuestion();
}

// Move to next question or show results if finished
function nextQuestion() {
  if (current >= totalQuestions - 1) showResult();
  else {
    current++;
    showQuestion();
  }
}

// Generate buttons for navigation palette
function generateQuestionButtons() {
  const container = document.getElementById("question-buttons");
  container.innerHTML = allQuestions
    .map((_, i) => `<button id="qbtn-${i}" onclick="goToQuestion(${i})">${i + 1}</button>`)
    .join("");
}

// Go to specific question
function goToQuestion(i) {
  current = i;
  showQuestion();
}

// Update palette buttons style for active/answered/unanswered
function updateActiveButton() {
  document.querySelectorAll("#question-buttons button").forEach((btn, i) => {
    btn.classList.remove("active", "answered", "unanswered");
    if (i === current) btn.classList.add("active");
    if (userAnswers[i] === null) btn.classList.add("unanswered");
    else if (userAnswers[i]) btn.classList.add("answered");
  });
}

// Timer countdown and auto submit on timeout
function startTimer(duration) {
  let time = duration;
  const timerDisplay = document.getElementById("timer");
  const interval = setInterval(() => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    timerDisplay.textContent = `Time Left: ${mins}:${secs < 10 ? "0" + secs : secs}`;
    if (--time < 0) {
      clearInterval(interval);
      alert("Time's up! Submitting your answers...");
      showResult();
    }
  }, 1000);
}

// Mark current question for review, highlight button, and move next
function markForReview() {
  const btn = document.getElementById(`qbtn-${current}`);
  btn.style.background = "#f0ad4e";
  btn.style.color = "white";
  nextQuestion();
}

// Clear selected answer on current question
function clearResponse() {
  const checked = document.querySelector('input[name="option"]:checked');
  if (checked) checked.checked = false;
  delete userAnswers[current];
  const btn = document.getElementById(`qbtn-${current}`);
  btn.classList.add("unanswered");
  btn.classList.remove("answered");
}

// Show results page with score and total question count via query params
function showResult() {
  window.location.href = `result.html?score=${score.toFixed(2)}&total=${totalQuestions}`;
}
