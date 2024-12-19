"use strict";
const modeBtn = document.getElementById("mode");
const backgr = document.querySelector(".background");
const video = document.querySelector(".video-bg");
const newGameBtn = document.getElementById("new_Game");
const nexBtn = document.getElementById("next");
const backBtn = document.getElementById("back");
const starBtn = document.getElementById("starBtn");
const answerContainer = document.querySelector(".answer");
const submitBtn = document.getElementById("submit");

let userAnswers = [];
let quizData = [];
let currentQuestionIndex = 0;
//Mode button Dark / Light
modeBtn.addEventListener("click", () => {
  document.body.classList.toggle("background-black");

  if (document.body.classList.contains("background-black")) {
    video.classList.remove("video-bg-hidden");
    modeBtn.textContent = "Light";
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
  } else {
    video.classList.add("video-bg-hidden");
    modeBtn.textContent = "Dark";
    document.body.classList.add("light-mode");
    document.body.classList.remove("dark-mode");
  }
});
// Hantera start button
starBtn.addEventListener("click", () => {
  starBtn.style.display = "none";
  // Hämta Json file
  fetch("./questions.json")
    .then((res) => res.json())
    .then((data) => {
      quizData = data;
      showQuestion(currentQuestionIndex);
    })
    .catch((err) => console.error("Fel vid laddning av JSON:", err));
  //Visa en fråga baserat på index
  function showQuestion(index) {
    const questionData = quizData[index];
    answerContainer.innerHTML = "";
    // Skapa fråga och svarsalternativ dynamiskt
    const quertionTitle = document.createElement("h3");
    quertionTitle.textContent = questionData.question;
    answerContainer.appendChild(quertionTitle);
    // Generera svarsalternativ beroende på typ
    if (questionData.type == "true_false") {
      questionData.answers.forEach((answer) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="answer" value="${answer}"> ${answer}`;
        answerContainer.appendChild(label);
      });
    } else if (
      questionData.type === "multiple_choice" ||
      questionData.type === "checkbox"
    ) {
      questionData.answers.forEach((answer) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" name="answer" value="${answer}"> ${answer}`;
        answerContainer.appendChild(label);
      });
    }
  }
  // Hantera navigering next
  nexBtn.addEventListener("click", () => {
    saveAnswer();
    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
    } else {
      alert("Det finns inga fler frågor!");
    }
  });
  // Hantera navigering next
  backBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
    } else {
      alert("Du är redan på den första frågan!");
    }
  });
  // Spara användarens svar
  function saveAnswer() {
    const selectedAnswers = Array.from(
      document.querySelectorAll('input[name="answer"]:checked')
    ).map((input) => input.value);
    if (selectedAnswers.length > 0) {
      userAnswers[currentQuestionIndex] = selectedAnswers;
    } else {
      userAnswers[currentQuestionIndex] = [];
    }
  }
  // Beräkna resultat och visa feedback
  submitBtn.addEventListener("click", () => {
    submitBtn.disabled = true;
    submitBtn.textContent = "Beräknar...";

    saveAnswer();
    const resultDiv = document.querySelector(".result_test");
    let correctCount = 0;
    // Granskar användarens svar för varje fråga
    quizData.forEach((question, index) => {
      const correctAnswers = Array.isArray(question.correct)
        ? question.correct
        : [question.correct];
      //   const isCorrect =
      //     correctAnswers.every((answer) => userAnswers.includes(answer)) &&
      //     correctAnswers.length === userAnswers.length;
      const userAnswer = userAnswers[index] || [];
      const isCorrect =
        correctAnswers.every((answer) => userAnswer.includes(answer)) &&
        correctAnswers.length === userAnswer.length;

      if (isCorrect) correctCount++;
    });
    // Visa resultat med färg och text
    const scorePercentage = (correctCount / quizData.length) * 100;
    if (scorePercentage < 50) {
      resultDiv.textContent = `Underkänt (${correctCount}/${quizData.length} rätt)`;
      resultDiv.className = "result red";
    } else if (scorePercentage <= 75) {
      resultDiv.textContent = `Bra (${correctCount}/${quizData.length} rätt)`;
      resultDiv.className = "result yellow";
    } else {
      resultDiv.textContent = `Riktigt bra jobbat (${correctCount}/${quizData.length} rätt)`;
      resultDiv.className = "result green";
    }

    //Visa vilka frågor som var rätt eller fel
    quizData.forEach((question, index) => {
      const correctAnswers = Array.isArray(question.correct)
        ? question.correct
        : [question.correct];
      const userAnswer = userAnswers[index] || [];
      const isCorrect =
        correctAnswers.every((answer) => userAnswer.includes(answer)) &&
        correctAnswers.length === userAnswer.length;

      console.log(`Fråga ${index + 1}: ${isCorrect ? "Rätt" : "Fel"}`);
      console.log(`Ditt svar: ${userAnswer}`);
      console.log(`Rätt svar: ${correctAnswers}`);
    });
    submitBtn.disabled = false;
    submitBtn.textContent = "SUBMIT";

    // Hantera "New Game"-knappen
    newGameBtn.addEventListener("click", () => {
      // Återställ quizdata, användarens svar, och nuvarande fråga
      currentQuestionIndex = 0;
      userAnswers = [];
      resultDiv.textContent = ""; // Ta bort tidigare resultat
      resultDiv.className = ""; // Ta bort resultatklass

      // Återställ "Starta quiz"-knappen
      starBtn.style.display = "block";

      // Omstart av spelet (kan även göra om frågorna och andra element behövs)
      fetch("./questions.json")
        .then((res) => res.json())
        .then((data) => {
          quizData = data;
          showQuestion(currentQuestionIndex);
        })
        .catch((err) => console.error("Fel vid laddning av JSON:", err));
    });
  });
});
