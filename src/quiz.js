const question = document.querySelector("#question");
const nextbtn = document.querySelector(".btn");
const choices = Array.from(document.getElementsByClassName("text"));
const texts = document.querySelectorAll(".text");
const progressText = document.getElementById("progressText");
const progressbarfull = document.getElementById("progressbarfull");
const loader = document.getElementById("loadingdiv");
const game = document.getElementById("game");
console.log('hi')
let currentQuestion = {};
let acceptingQuestion = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

let testNum = localStorage.getItem("num");
let fileName = `unit${testNum}.json`;
console.log(fileName)
fetch(fileName)
  .then((res) => {
    return res.json();
  })
  .then((returned) => {
    questions = returned;
    startGame();
  })
  .catch((err) => {
    console.log(err);
  });

const correctplus = testNum == "10" ? 2 : 4;
const maxQuestions = testNum == "10" ? 50 : 25;

let getNewQuestion = () => {
  questionCounter++;
  progressText.innerText = `Question: ${questionCounter}/${maxQuestions}`;

  progressbarfull.style.width = `${(questionCounter / maxQuestions) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
    choice.disabled = false;
  });
  availableQuestions.splice(questionIndex, 1);
  acceptingQuestion = true;
  nextbtn.disabled = true;
  choices.forEach((choice) => {
    choice.parentElement.classList.remove("correct");
    choice.parentElement.classList.remove("wrong");
    choice.parentElement.classList.remove("disabled");
  });
};

let startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    answerChoice(e);
    nextbtn.disabled = false;
  });
});

let answerChoice = (click) => {
  let selectedChoice = click.target;
  let correctChoice = document.querySelector(`#one${currentQuestion.answer}`);
  let selectedAnswer = selectedChoice.dataset.number;
  let Correct =
    selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
  choices.forEach((choice) => {
    choice.parentElement.classList.add("disabled");
    choice.disabled = true;
  });
  if (Correct === "correct") {
    incrementScore(correctplus);
    selectedChoice.parentElement.classList.add("correct");
  } else if (Correct === "incorrect") {
    selectedChoice.parentElement.classList.add("wrong");
    correctChoice.parentElement.classList.add("correct");
  }
};

nextbtn.addEventListener("click", () => {
  if (availableQuestions.length === 0 || questionCounter >= maxQuestions) {
    localStorage.setItem(`unit${testNum}score`, score);
    return window.location.assign(`unit${testNum}results.html`);
  } else {
    getNewQuestion();
  }
});

let incrementScore = (num) => {
  score += num;
};

//add parameter to getNewQuestion to
