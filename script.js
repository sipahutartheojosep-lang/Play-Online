
const memoryBoard = document.querySelector(".memory-board");
const scoreElement = document.querySelector("#memory-score");
const restartButton = document.querySelector("#restart-memory");

if (!memoryBoard) {
    console.error("Memory board tidak ditemukan!");
} else {

    const symbols = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍍"];

    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;
    let score = 0;

    function updateScore() {
        if (scoreElement) {
            scoreElement.textContent = score;
        }
    }

    function resetTurn() {
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    function flipCard(card) {
        if (
            lockBoard ||
            card.classList.contains("matched") ||
            card === firstCard
        ) {
            return;
        }

        card.textContent = card.dataset.symbol;
        card.classList.add("flipped");

        if (!firstCard) {
            firstCard = card;
            return;
        }

        secondCard = card;
        lockBoard = true;

        if (
            firstCard.dataset.symbol ===
            secondCard.dataset.symbol
        ) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");

            matchedPairs++;
            score += 10;

            updateScore();
            resetTurn();

            if (matchedPairs === symbols.length) {
                setTimeout(() => {
                    alert("Selamat! Semua pasangan berhasil ditemukan!");
                }, 300);
            }

        } else {
            score = Math.max(0, score - 2);
            updateScore();

            setTimeout(() => {
                firstCard.textContent = "?";
                secondCard.textContent = "?";

                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");

                resetTurn();
            }, 800);
        }
    }

    function createBoard() {
        memoryBoard.innerHTML = "";

        cards = [...symbols, ...symbols];

        // Mengacak kartu
        cards.sort(() => Math.random() - 0.5);

        cards.forEach(symbol => {
            const card = document.createElement("button");

            card.type = "button";
            card.className = "memory-card";
            card.textContent = "?";
            card.dataset.symbol = symbol;

            card.addEventListener("click", () => {
                flipCard(card);
            });

            memoryBoard.appendChild(card);
        });

        matchedPairs = 0;
        score = 0;

        resetTurn();
        updateScore();
    }

    if (restartButton) {
        restartButton.addEventListener("click", createBoard);
    }

    // Langsung membuat kartu saat halaman dibuka
    createBoard();
}

// ===================================
// PLAYLAB - TRIVIA CHALLENGE
// ===================================

const triviaQuestions = [
    {
        question: "What is the capital city of Indonesia?",
        options: ["Jakarta", "Medan", "Bandung", "Surabaya"],
        answer: "Jakarta"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars"
    },
    {
        question: "How many days are there in a week?",
        options: ["Five", "Six", "Seven", "Eight"],
        answer: "Seven"
    },
    {
        question: "What is the opposite of 'Hot'?",
        options: ["Warm", "Cold", "Dry", "Bright"],
        answer: "Cold"
    },
    {
        question: "Which animal is known as the King of the Jungle?",
        options: ["Tiger", "Elephant", "Lion", "Zebra"],
        answer: "Lion"
    }
];

const triviaQuestion = document.querySelector("#trivia-question");
const answerOptions = document.querySelector("#answer-options");
const triviaScore = document.querySelector("#trivia-score");
const questionNumber = document.querySelector("#question-number");
const triviaFeedback = document.querySelector("#trivia-feedback");
const nextQuestion = document.querySelector("#next-question");
const triviaProgress = document.querySelector("#trivia-progress");
const triviaResult = document.querySelector("#trivia-result");

if (triviaQuestion && answerOptions) {

    let currentQuestion = 0;
    let score = 0;
    let answered = false;

    function showQuestion() {

        answered = false;

        const question = triviaQuestions[currentQuestion];

        triviaQuestion.textContent = question.question;

        questionNumber.textContent =
            `Question ${currentQuestion + 1} / ${triviaQuestions.length}`;

        triviaScore.textContent = score;

        triviaFeedback.textContent = "";
        triviaFeedback.className = "";

        nextQuestion.disabled = true;
        nextQuestion.textContent = "Pertanyaan Berikutnya →";

        answerOptions.innerHTML = "";
        triviaResult.innerHTML = "";

        triviaProgress.style.width =
            `${(currentQuestion / triviaQuestions.length) * 100}%`;

        question.options.forEach(option => {

            const button = document.createElement("button");

            button.className = "answer-button";
            button.textContent = option;

            button.addEventListener("click", () => {
                checkAnswer(button, option);
            });

            answerOptions.appendChild(button);
        });
    }

    function checkAnswer(button, selectedAnswer) {

        if (answered) return;

        answered = true;

        const correctAnswer =
            triviaQuestions[currentQuestion].answer;

        const buttons =
            answerOptions.querySelectorAll(".answer-button");

        buttons.forEach(btn => {
            btn.disabled = true;

            if (btn.textContent === correctAnswer) {
                btn.classList.add("correct");
            }
        });

        if (selectedAnswer === correctAnswer) {

            score += 10;

            triviaFeedback.textContent =
                "Benar! Kamu mendapatkan 10 poin! 🎉";

            triviaFeedback.className = "correct-text";

        } else {

            button.classList.add("wrong");

            triviaFeedback.textContent =
                `Belum tepat! Jawaban yang benar adalah ${correctAnswer}.`;

            triviaFeedback.className = "wrong-text";
        }

        triviaScore.textContent = score;

        nextQuestion.disabled = false;

        if (currentQuestion === triviaQuestions.length - 1) {
            nextQuestion.textContent = "Lihat Hasil →";
        }
    }

    function showResult() {

        triviaProgress.style.width = "100%";

        triviaQuestion.textContent = "Quiz Completed! 🎉";

        answerOptions.innerHTML = "";

        triviaFeedback.textContent = "";

        nextQuestion.style.display = "none";

        triviaResult.innerHTML = `
            <h2>Permainan Selesai!</h2>
            <p>Skor akhir kamu:</p>
            <h1>${score} / 50 PTS</h1>
            <button id="restart-trivia" class="restart-button">
                Main Lagi ↻
            </button>
        `;

        document.querySelector("#restart-trivia")
            .addEventListener("click", () => {

                currentQuestion = 0;
                score = 0;

                nextQuestion.style.display = "inline-block";

                showQuestion();
            });
    }

    nextQuestion.addEventListener("click", () => {

        if (!answered) return;

        currentQuestion++;

        if (currentQuestion < triviaQuestions.length) {
            showQuestion();
        } else {
            showResult();
        }
    });

    showQuestion();
}
