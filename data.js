// US States and Capitals Data
const STATES_DATA = [
    { id: 'alabama', name: 'Alabama', capital: 'Montgomery' },
    { id: 'alaska', name: 'Alaska', capital: 'Juneau' },
    { id: 'arizona', name: 'Arizona', capital: 'Phoenix' },
    { id: 'arkansas', name: 'Arkansas', capital: 'Little Rock' },
    { id: 'california', name: 'California', capital: 'Sacramento' },
    { id: 'colorado', name: 'Colorado', capital: 'Denver' },
    { id: 'connecticut', name: 'Connecticut', capital: 'Hartford' },
    { id: 'delaware', name: 'Delaware', capital: 'Dover' },
    { id: 'florida', name: 'Florida', capital: 'Tallahassee' },
    { id: 'georgia', name: 'Georgia', capital: 'Atlanta' },
    { id: 'hawaii', name: 'Hawaii', capital: 'Honolulu' },
    { id: 'idaho', name: 'Idaho', capital: 'Boise' },
    { id: 'illinois', name: 'Illinois', capital: 'Springfield' },
    { id: 'indiana', name: 'Indiana', capital: 'Indianapolis' },
    { id: 'iowa', name: 'Iowa', capital: 'Des Moines' },
    { id: 'kansas', name: 'Kansas', capital: 'Topeka' },
    { id: 'kentucky', name: 'Kentucky', capital: 'Frankfort' },
    { id: 'louisiana', name: 'Louisiana', capital: 'Baton Rouge' },
    { id: 'maine', name: 'Maine', capital: 'Augusta' },
    { id: 'maryland', name: 'Maryland', capital: 'Annapolis' },
    { id: 'massachusetts', name: 'Massachusetts', capital: 'Boston' },
    { id: 'michigan', name: 'Michigan', capital: 'Lansing' },
    { id: 'minnesota', name: 'Minnesota', capital: 'Saint Paul' },
    { id: 'mississippi', name: 'Mississippi', capital: 'Jackson' },
    { id: 'missouri', name: 'Missouri', capital: 'Jefferson City' },
    { id: 'montana', name: 'Montana', capital: 'Helena' },
    { id: 'nebraska', name: 'Nebraska', capital: 'Lincoln' },
    { id: 'nevada', name: 'Nevada', capital: 'Carson City' },
    { id: 'new-hampshire', name: 'New Hampshire', capital: 'Concord' },
    { id: 'new-jersey', name: 'New Jersey', capital: 'Trenton' },
    { id: 'new-mexico', name: 'New Mexico', capital: 'Santa Fe' },
    { id: 'new-york', name: 'New York', capital: 'Albany' },
    { id: 'north-carolina', name: 'North Carolina', capital: 'Raleigh' },
    { id: 'north-dakota', name: 'North Dakota', capital: 'Bismarck' },
    { id: 'ohio', name: 'Ohio', capital: 'Columbus' },
    { id: 'oklahoma', name: 'Oklahoma', capital: 'Oklahoma City' },
    { id: 'oregon', name: 'Oregon', capital: 'Salem' },
    { id: 'pennsylvania', name: 'Pennsylvania', capital: 'Harrisburg' },
    { id: 'rhode-island', name: 'Rhode Island', capital: 'Providence' },
    { id: 'south-carolina', name: 'South Carolina', capital: 'Columbia' },
    { id: 'south-dakota', name: 'South Dakota', capital: 'Pierre' },
    { id: 'tennessee', name: 'Tennessee', capital: 'Nashville' },
    { id: 'texas', name: 'Texas', capital: 'Austin' },
    { id: 'utah', name: 'Utah', capital: 'Salt Lake City' },
    { id: 'vermont', name: 'Vermont', capital: 'Montpelier' },
    { id: 'virginia', name: 'Virginia', capital: 'Richmond' },
    { id: 'washington', name: 'Washington', capital: 'Olympia' },
    { id: 'west-virginia', name: 'West Virginia', capital: 'Charleston' },
    { id: 'wisconsin', name: 'Wisconsin', capital: 'Madison' },
    { id: 'wyoming', name: 'Wyoming', capital: 'Cheyenne' }
];

// Quiz Types
const QUIZ_TYPES = {
    IDENTIFY_STATES: 'identify-states',
    STATES: 'states',
    CAPITALS: 'capitals',
};

// Common wrong answers for better multiple choice generation
const COMMON_CAPITALS = [
    'Atlanta', 'Austin', 'Boston', 'Charleston', 'Chicago', 'Columbus',
    'Denver', 'Detroit', 'Houston', 'Indianapolis', 'Jacksonville',
    'Las Vegas', 'Los Angeles', 'Miami', 'Milwaukee', 'Nashville',
    'New Orleans', 'New York City', 'Philadelphia', 'Phoenix',
    'Portland', 'San Antonio', 'Seattle', 'Tampa', 'Virginia Beach'
];

const COMMON_STATES = [
    'Alabama', 'Arizona', 'California', 'Colorado', 'Florida', 'Georgia',
    'Illinois', 'Indiana', 'Louisiana', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota', 'Missouri', 'Nevada', 'New York',
    'North Carolina', 'Ohio', 'Pennsylvania', 'Tennessee', 'Texas',
    'Virginia', 'Washington', 'Wisconsin'
];

// Utility functions for data access
function getAllStates() {
    return [...STATES_DATA];
}

function getStateById(id) {
    return STATES_DATA.find(state => state.id === id);
}

function getStateByName(name) {
    return STATES_DATA.find(state => state.name === name);
}

function getStateByCapital(capital) {
    return STATES_DATA.find(state => state.capital === capital);
}

function getRandomStates(count = 4, exclude = []) {
    const available = STATES_DATA.filter(state => !exclude.includes(state));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Quiz Question Generation Functions

function generateCapitalQuestion(state) {
    const correctAnswer = state.capital;
    const wrongAnswers = generateWrongCapitals(correctAnswer, 3);
    const allAnswers = shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
        type: QUIZ_TYPES.CAPITALS,
        question: `What is the capital of ${state.name}?`,
        correctAnswer: correctAnswer,
        options: allAnswers,
        stateId: state.id,
        stateName: state.name
    };
}

function generateStateQuestion(state) {
    const correctAnswer = state.name;
    const wrongAnswers = generateWrongStates(correctAnswer, 3);
    const allAnswers = shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
        type: QUIZ_TYPES.STATES,
        question: `Which state has ${state.capital} as its capital?`,
        correctAnswer: correctAnswer,
        options: allAnswers,
        stateId: state.id,
        stateName: state.name
    };
}

function generateIdentifyStateQuestion(state) {
    const correctAnswer = state.name;
    const wrongAnswers = generateWrongStates(correctAnswer, 3);
    const allAnswers = shuffleArray([correctAnswer, ...wrongAnswers]);

    return {
        type: QUIZ_TYPES.IDENTIFY_STATES,
        question: `What is the name of the highlighted state?`,
        correctAnswer: correctAnswer,
        options: allAnswers,
        stateId: state.id,
        stateName: state.name
    };
}

function generateWrongCapitals(correctCapital, count = 3) {
    const allCapitals = STATES_DATA.map(state => state.capital);
    const wrongCapitals = allCapitals.filter(capital => capital !== correctCapital);

    // Mix actual capitals with common wrong answers
    const mixedOptions = [...wrongCapitals, ...COMMON_CAPITALS];
    const uniqueOptions = [...new Set(mixedOptions)].filter(capital => capital !== correctCapital);

    return shuffleArray(uniqueOptions).slice(0, count);
}

function generateWrongStates(correctState, count = 3) {
    const allStates = STATES_DATA.map(state => state.name);
    const wrongStates = allStates.filter(state => state !== correctState);

    // Mix actual states with common wrong answers
    const mixedOptions = [...wrongStates, ...COMMON_STATES];
    const uniqueOptions = [...new Set(mixedOptions)].filter(state => state !== correctState);

    return shuffleArray(uniqueOptions).slice(0, count);
}

function generateQuiz(type, numberOfQuestions = 50) {
    const shuffledStates = shuffleArray(STATES_DATA);
    const selectedStates = shuffledStates.slice(0, numberOfQuestions);

    const questions = selectedStates.map(state => {
        if (type === QUIZ_TYPES.CAPITALS) {
            return generateCapitalQuestion(state);
        } else if (type === QUIZ_TYPES.IDENTIFY_STATES) {
            return generateIdentifyStateQuestion(state);
        } else {
            return generateStateQuestion(state);
        }
    });

    return {
        type: type,
        questions: questions,
        totalQuestions: questions.length
    };
}

function generateRandomizedQuiz(type) {
    return generateQuiz(type, STATES_DATA.length);
}
