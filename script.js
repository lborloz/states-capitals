// Quiz Application State
class QuizApp {
    constructor() {
        this.currentQuizType = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;

        this.initializeElements();
        this.bindEvents();
        this.showScreen('quiz-selection');
    }

    initializeElements() {
        // Screens
        this.screens = {
            selection: document.getElementById('quiz-selection'),
            quiz: document.getElementById('quiz-screen'),
            results: document.getElementById('results-screen'),
            review: document.getElementById('review-screen')
        };

        // Buttons
        this.buttons = {
            statesQuiz: document.getElementById('states-quiz-btn'),
            capitalsQuiz: document.getElementById('capitals-quiz-btn'),
            identifyStatesQuiz: document.getElementById('identify-states-quiz-btn'),
            startOver: document.getElementById('start-over-btn'),
            nextQuestion: document.getElementById('next-question-btn'),
            reviewAnswers: document.getElementById('review-answers-btn'),
            newQuiz: document.getElementById('new-quiz-btn'),
            backToResults: document.getElementById('back-to-results-btn')
        };

        // Quiz elements
        this.quizTitle = document.getElementById('quiz-title');
        this.questionCounter = document.getElementById('question-counter');
        this.scoreDisplay = document.getElementById('score-display');
        this.questionText = document.getElementById('question-text');
        this.answerButtons = document.querySelectorAll('.answer-btn');
        this.feedback = document.getElementById('feedback');
        this.feedbackText = document.getElementById('feedback-text');

        // Results elements
        this.finalScoreDisplay = document.getElementById('final-score-display');
        this.reviewList = document.getElementById('review-list');
    }

    bindEvents() {
        // Quiz type selection
        this.buttons.statesQuiz.addEventListener('click', () => this.startQuiz(QUIZ_TYPES.STATES));
        this.buttons.capitalsQuiz.addEventListener('click', () => this.startQuiz(QUIZ_TYPES.CAPITALS));
        this.buttons.identifyStatesQuiz.addEventListener('click', () => this.startQuiz(QUIZ_TYPES.IDENTIFY_STATES));

        // Quiz controls
        this.buttons.startOver.addEventListener('click', () => this.startOver());
        this.buttons.nextQuestion.addEventListener('click', () => this.nextQuestion());

        // Results controls
        this.buttons.reviewAnswers.addEventListener('click', () => this.showReview());
        this.buttons.newQuiz.addEventListener('click', () => this.startOver());
        this.buttons.backToResults.addEventListener('click', () => this.showScreen('results-screen'));

        // Answer buttons
        this.answerButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.selectAnswer(index));
        });
    }

    showScreen(screenId) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }
    }

    startQuiz(quizType) {
        this.currentQuizType = quizType;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.questions = this.generateQuestions(quizType);

        // Update quiz title
        if (quizType === QUIZ_TYPES.STATES) {
            this.quizTitle.textContent = 'States Quiz';
        } else if (quizType === QUIZ_TYPES.CAPITALS) {
            this.quizTitle.textContent = 'Capitals Quiz';
        } else if (quizType === QUIZ_TYPES.IDENTIFY_STATES) {
            this.quizTitle.textContent = 'Identify States Quiz';
        }

        this.showScreen('quiz-screen');
        this.displayQuestion();
    }

    generateQuestions(quizType) {
        const allStates = shuffleArray(getAllStates());
        const questions = [];

        allStates.forEach(state => {
            if (quizType === QUIZ_TYPES.CAPITALS) {
                // "What is the capital of [state]?"
                const wrongAnswers = this.getWrongCapitals(state.capital, 3);
                const answers = shuffleArray([state.capital, ...wrongAnswers]);

                questions.push({
                    type: QUIZ_TYPES.CAPITALS,
                    state: state,
                    question: `What is the capital of ${state.name}?`,
                    answers: answers,
                    correctAnswer: state.capital,
                    correctIndex: answers.indexOf(state.capital)
                });
            } else if (quizType === QUIZ_TYPES.IDENTIFY_STATES) {
                // "What is the name of this state?"
                const wrongAnswers = this.getWrongStates(state.name, 3);
                const answers = shuffleArray([state.name, ...wrongAnswers]);

                questions.push({
                    type: QUIZ_TYPES.IDENTIFY_STATES,
                    state: state,
                    question: `What is the name of this state?`,
                    answers: answers,
                    correctAnswer: state.name,
                    correctIndex: answers.indexOf(state.name)
                });
            } else {
                // "Which state has [capital] as its capital?"
                const wrongAnswers = this.getWrongStates(state.name, 3);
                const answers = shuffleArray([state.name, ...wrongAnswers]);

                questions.push({
                    type: QUIZ_TYPES.STATES,
                    state: state,
                    question: `Which state has ${state.capital} as its capital?`,
                    answers: answers,
                    correctAnswer: state.name,
                    correctIndex: answers.indexOf(state.name)
                });
            }
        });

        return questions;
    }

    getWrongCapitals(correctCapital, count) {
        const allCapitals = STATES_DATA.map(state => state.capital).filter(cap => cap !== correctCapital);
        const commonWrongAnswers = COMMON_CAPITALS.filter(cap => cap !== correctCapital);

        // Prefer common wrong answers, but fall back to random capitals if needed
        const candidates = [...commonWrongAnswers, ...allCapitals];
        const unique = [...new Set(candidates)];
        const shuffled = shuffleArray(unique);

        return shuffled.slice(0, count);
    }

    getWrongStates(correctState, count) {
        const allStates = STATES_DATA.map(state => state.name).filter(name => name !== correctState);
        const commonWrongAnswers = COMMON_STATES.filter(name => name !== correctState);

        // Prefer common wrong answers, but fall back to random states if needed
        const candidates = [...commonWrongAnswers, ...allStates];
        const unique = [...new Set(candidates)];
        const shuffled = shuffleArray(unique);

        return shuffled.slice(0, count);
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        this.isAnswered = false;

        // Update question display
        this.questionText.textContent = question.question;
        this.questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        this.scoreDisplay.textContent = `Score: ${this.score}/${this.currentQuestionIndex}`;

        // Update answer buttons
        this.answerButtons.forEach((button, index) => {
            const answerText = button.querySelector('.answer-text');
            answerText.textContent = question.answers[index] || '';

            // Reset button states
            button.classList.remove('selected', 'correct', 'incorrect');
            button.disabled = false;
        });

        // Hide feedback
        this.feedback.classList.add('hidden');

        // Highlight current state on map
        if (window.highlightState) {
            window.highlightState(question.state.id);
        }
    }

    selectAnswer(answerIndex) {
        if (this.isAnswered) return;

        const question = this.questions[this.currentQuestionIndex];
        const selectedAnswer = question.answers[answerIndex];
        const isCorrect = answerIndex === question.correctIndex;

        this.isAnswered = true;

        // Update button states
        this.answerButtons.forEach((button, index) => {
            button.disabled = true;

            if (index === answerIndex) {
                button.classList.add('selected');
            }

            if (index === question.correctIndex) {
                button.classList.add('correct');
            } else if (index === answerIndex && !isCorrect) {
                button.classList.add('incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            this.score++;
        }

        // Store user answer
        this.userAnswers.push({
            question: question.question,
            userAnswer: selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: isCorrect,
            state: question.state
        });

        // Show feedback
        this.showFeedback(isCorrect, question.correctAnswer);
    }

    showFeedback(isCorrect, correctAnswer) {
        this.feedbackText.textContent = isCorrect
            ? 'Correct! Well done!'
            : `Incorrect. The correct answer is ${correctAnswer}.`;

        this.feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        this.feedback.classList.remove('hidden');

        // Update button text for last question
        if (this.currentQuestionIndex === this.questions.length - 1) {
            this.buttons.nextQuestion.textContent = 'Show Results';
        } else {
            this.buttons.nextQuestion.textContent = 'Next Question';
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.finalScoreDisplay.textContent = `${this.score}/${this.questions.length} (${percentage}%)`;

        this.showScreen('results-screen');

        // Clear map highlighting
        if (window.clearMapHighlight) {
            window.clearMapHighlight();
        }
    }

    showReview() {
        this.reviewList.innerHTML = '';

        this.userAnswers.forEach((answer, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;

            reviewItem.innerHTML = `
                <div class="review-question">${index + 1}. ${answer.question}</div>
                <div class="review-answer user">Your answer: ${answer.userAnswer}</div>
                ${!answer.isCorrect ? `<div class="review-answer correct">Correct answer: ${answer.correctAnswer}</div>` : ''}
            `;

            this.reviewList.appendChild(reviewItem);
        });

        this.showScreen('review-screen');
    }

    startOver() {
        this.currentQuizType = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;

        // Clear map highlighting
        if (window.clearMapHighlight) {
            window.clearMapHighlight();
        }

        this.showScreen('quiz-selection');
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizApp();
});
