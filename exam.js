let allQuestions = [];
let current = 0;
let score = 0;
let totalQuestions = 0;
let userAnswers = {};

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
            `<label><input type="radio" name="option" value="${key}"
            ${userAnswers[current] === key ? 'checked' : ''}> ${key}. ${val}</label>`
        )
        .join("")}
    </div>
  `;
  updateActiveButton();
}

function submitAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  const btn = document.getElementById(`qbtn-${current}`);

  if (!selected) {
    btn.classList.remove('answered');
    btn.classList.add('unanswered');
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
  btn.classList.remove('unanswered');
  btn.classList.add('answered');
  nextQuestion();
}

function nextQuestion() {
  current++;
  if (current >= totalQuestions) 
    showResult();
  else 
    showQuestion();
}

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
    .forEach((b, i) => {
      b.classList.remove("active");
      if (i === current) b.classList.add("active");

      if (userAnswers[i] === null) {
        b.classList.add('unanswered');
        b.classList.remove('answered');
      } else if (userAnswers[i]) {
        b.classList.add('answered');
        b.classList.remove('unanswered');
      } else {
        b.classList.remove('answered');
        b.classList.remove('unanswered');
      }
    });
}

function startTimer(duration) {
  let time = duration;
  const timerDisplay = document.getElementById("timer");
  const interval = setInterval(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    if (--time < 0) {
      clearInterval(interval);
      alert("Time's up! Submitting your answers...");
      showResult();
    }
  }, 1000);
}

function markForReview() {
  const btn = document.getElementById(`qbtn-${current}`);
  btn.style.background = "#f0ad4e";
  btn.style.color = "white";
  nextQuestion();
}

function clearResponse() {
  const checked = document.querySelector('input[name="option"]:checked');
  if (checked) checked.checked = false;
  delete userAnswers[current];
  const btn = document.getElementById(`qbtn-${current}`);
  btn.classList.add('unanswered');
  btn.classList.remove('answered');
}

function showResult() {
  window.location.href = `result.html?score=${score.toFixed(2)}&total=${totalQuestions}`;
}
