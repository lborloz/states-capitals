// Quiz Application State
class QuizApp {
    constructor() {
        this.currentQuizType = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isAnswered = false;
        
        // Timer properties
        this.startTime = null;
        this.endTime = null;
        this.completionTimeSeconds = 0;

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
            review: document.getElementById('review-screen'),
            bestScores: document.getElementById('best-scores-screen')
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
            backToResults: document.getElementById('back-to-results-btn'),
            viewBestScores: document.getElementById('view-best-scores-btn'),
            viewBestScoresFromResults: document.getElementById('view-best-scores-from-results-btn'),
            backToMainMenu: document.getElementById('back-to-main-menu-btn'),
            clearScores: document.getElementById('clear-scores-btn')
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
        this.completionTimeDisplay = document.getElementById('completion-time-display');
        this.reviewList = document.getElementById('review-list');

        // Best scores elements
        this.quizTypeTabs = document.querySelectorAll('.quiz-type-tab');
        this.bestScoresList = document.getElementById('best-scores-list');
        this.currentBestScoresTab = 'identify-states';
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

        // Best scores navigation
        this.buttons.viewBestScores.addEventListener('click', () => this.showBestScores());
        this.buttons.viewBestScoresFromResults.addEventListener('click', () => this.showBestScores());
        this.buttons.backToMainMenu.addEventListener('click', () => this.startOver());
        this.buttons.clearScores.addEventListener('click', () => this.clearCurrentQuizTypeScores());

        // Best scores tabs
        this.quizTypeTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchBestScoresTab(tab.dataset.quizType));
        });

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
        
        // Start the timer
        this.startTimer();

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
        // Stop the timer and save the score
        this.stopTimer();
        this.saveBestScore();
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.finalScoreDisplay.textContent = `${this.score}/${this.questions.length} (${percentage}%)`;
        
        // Display completion time
        this.completionTimeDisplay.textContent = `Time: ${this.formatTime(this.completionTimeSeconds)}`;

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
        
        // Reset timer
        this.startTime = null;
        this.endTime = null;
        this.completionTimeSeconds = 0;

        // Clear map highlighting
        if (window.clearMapHighlight) {
            window.clearMapHighlight();
        }

        this.showScreen('quiz-selection');
    }

    // Timer methods
    startTimer() {
        this.startTime = Date.now();
    }

    stopTimer() {
        this.endTime = Date.now();
        if (this.startTime) {
            this.completionTimeSeconds = Math.floor((this.endTime - this.startTime) / 1000);
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Best scores management
    getBestScores(quizType = null) {
        try {
            const stored = localStorage.getItem('quiz-best-scores');
            const allScores = stored ? JSON.parse(stored) : [];
            
            if (quizType) {
                return allScores.filter(score => score.quizType === quizType);
            }
            
            return allScores;
        } catch (error) {
            console.warn('Error loading best scores:', error);
            return [];
        }
    }

    saveBestScore() {
        if (!this.currentQuizType || this.completionTimeSeconds === 0) return;

        const newScore = {
            quizType: this.currentQuizType,
            score: this.score,
            total: this.questions.length,
            percentage: Math.round((this.score / this.questions.length) * 100),
            timeSeconds: this.completionTimeSeconds,
            timeFormatted: this.formatTime(this.completionTimeSeconds),
            date: new Date().toISOString()
        };

        try {
            const allScores = this.getBestScores();
            const quizTypeScores = allScores.filter(score => score.quizType === this.currentQuizType);
            const otherScores = allScores.filter(score => score.quizType !== this.currentQuizType);

            // Add new score and sort by score (desc) then time (asc)
            quizTypeScores.push(newScore);
            quizTypeScores.sort((a, b) => {
                if (b.score !== a.score) {
                    return b.score - a.score; // Higher score first
                }
                return a.timeSeconds - b.timeSeconds; // Faster time first
            });

            // Keep only top 10 for this quiz type
            const topScores = quizTypeScores.slice(0, 10);
            
            // Combine with other quiz types and save
            const updatedScores = [...otherScores, ...topScores];
            localStorage.setItem('quiz-best-scores', JSON.stringify(updatedScores));
            
            return true;
        } catch (error) {
            console.warn('Error saving best score:', error);
            return false;
        }
    }

    clearBestScores(quizType = null) {
        try {
            if (quizType) {
                // Clear scores for specific quiz type
                const allScores = this.getBestScores();
                const filteredScores = allScores.filter(score => score.quizType !== quizType);
                localStorage.setItem('quiz-best-scores', JSON.stringify(filteredScores));
            } else {
                // Clear all scores
                localStorage.removeItem('quiz-best-scores');
            }
            return true;
        } catch (error) {
            console.warn('Error clearing best scores:', error);
            return false;
        }
    }

    // Best scores display methods
    showBestScores() {
        this.showScreen('best-scores-screen');
        this.renderBestScores(this.currentBestScoresTab);
    }

    switchBestScoresTab(quizType) {
        // Update active tab
        this.quizTypeTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.quizType === quizType);
        });

        this.currentBestScoresTab = quizType;
        this.renderBestScores(quizType);
    }

    renderBestScores(quizType) {
        const scores = this.getBestScores(quizType);
        
        if (scores.length === 0) {
            this.bestScoresList.innerHTML = `
                <div class="empty-scores">
                    <p>No scores yet for this quiz type.</p>
                    <p>Complete a quiz to see your best results here!</p>
                </div>
            `;
            return;
        }

        const scoresHtml = scores.map((score, index) => {
            const date = new Date(score.date).toLocaleDateString();
            return `
                <div class="best-score-item">
                    <div class="rank">#${index + 1}</div>
                    <div class="score-info">
                        <div class="score">${score.score}/${score.total} (${score.percentage}%)</div>
                        <div class="time-date">
                            <span class="time">Time: ${score.timeFormatted}</span>
                            <span class="date">${date}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.bestScoresList.innerHTML = scoresHtml;
    }

    clearCurrentQuizTypeScores() {
        const quizTypeName = this.getQuizTypeName(this.currentBestScoresTab);
        
        if (confirm(`Are you sure you want to clear all scores for "${quizTypeName}"? This action cannot be undone.`)) {
            if (this.clearBestScores(this.currentBestScoresTab)) {
                this.renderBestScores(this.currentBestScoresTab);
            } else {
                alert('Failed to clear scores. Please try again.');
            }
        }
    }

    getQuizTypeName(quizType) {
        switch (quizType) {
            case QUIZ_TYPES.IDENTIFY_STATES:
                return 'Identify States';
            case QUIZ_TYPES.CAPITALS:
                return 'Capitals from States';
            case QUIZ_TYPES.STATES:
                return 'States from Capitals';
            default:
                return 'Unknown Quiz Type';
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new QuizApp();
});
