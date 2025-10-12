
let allQuestions = [];
let current = 0;
let score = 0;
let totalQuestions = 0;
let userAnswers = {};  

// Load all questions
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
    startTimer(30 * 60);
  } catch (err) {
    document.getElementById("question-box").innerHTML =
      "<p>Error loading questions. Please check your file.</p>";
  }
}

// Display a question
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
            `<label><input type="radio" name="option" value="${key}"> ${key}. ${val}</label>`
        )
        .join("")}
    </div>
  `;

  updateActiveButton();
}

// Handle Save & Next
function submitAnswer() {
  console.log("✅ Save & Next clicked");  // Debug check

  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    alert("Please select an option before submitting.");
    return;
  }

  const chosen = selected.value;
  const correct = allQuestions[current].correct_option;

  if (!(current in userAnswers)) {
    if (chosen === correct) score += allQuestions[current].marks;
    else score += allQuestions[current].negative_marks;
  }

  userAnswers[current] = chosen;

  const btn = document.getElementById(`qbtn-${current}`);
  if (btn) {
    btn.style.background = "green";
    btn.style.color = "white";
  } else {
    console.log("⚠️ Button not found: qbtn-" + current);
  }

  nextQuestion();
}


function nextQuestion() {
  current++;
  if (current >= totalQuestions) 
    showResult();
  else 
    showQuestion();
}

// Generate right-side question buttons
function generateQuestionButtons() {
  const container = document.getElementById("question-buttons");
  container.innerHTML = allQuestions
    .map(
      (_, i) => `<button id="qbtn-${i}" onclick="goToQuestion(${i})">${i + 1}</button>`
    )
    .join("");
}

function goToQuestion(i) {
  current = i;
  showQuestion();
}

function updateActiveButton() {
  document
    .querySelectorAll("#question-buttons button")
    .forEach((b) => b.classList.remove("active"));
  document.getElementById(`qbtn-${current}`).classList.add("active");
}

// Timer
function startTimer(duration) {
  let time = duration;
  const timerDisplay = document.getElementById("timer");

  const interval = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `Time Left: ${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;

    if (--time < 0) {
      clearInterval(interval);
      alert("Time's up! Submitting your answers...");
      showResult();
    }
  }, 1000);
}

// Mark for review & clear response (UI only)
function markForReview() {
  document.getElementById(`qbtn-${current}`).style.background = "#f0ad4e";
  nextQuestion();
}

function clearResponse() {
  const checked = document.querySelector('input[name="option"]:checked');
  if (checked) checked.checked = false;
}

// Result
function showResult() {
  window.location.href = `result.html?score=${score.toFixed(2)}&total=${totalQuestions}`;
}
