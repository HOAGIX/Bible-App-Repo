const multipleChoiceQuestions = [
  {
    questionText: 'What is the first book of the Bible?',
    answerOptions: [
        { answerText: 'Genesis', isCorrect: true },
        { answerText: 'Exodus', isCorrect: false },
        { answerText: 'Leviticus', isCorrect: false },
        { answerText: 'Numbers', isCorrect: false },
    ],
    },
    {
    questionText: 'Who led the Israelites out of Egypt?',
    answerOptions: [
        { answerText: 'Moses', isCorrect: true },
        { answerText: 'Abraham', isCorrect: false },
        { answerText: 'David', isCorrect: false },
        { answerText: 'Solomon', isCorrect: false },
    ],
    },
    {
    questionText: 'What is the longest book in the Bible?',
    answerOptions: [
        { answerText: 'Psalms', isCorrect: true },
        { answerText: 'Isaiah', isCorrect: false },
        { answerText: 'Genesis', isCorrect: false },
        { answerText: 'Revelation', isCorrect: false },
    ],
    },
];

const matchQuestions = [
  {
    questionText: 'In the world you will have ______. But take heart; I have overcome the world', // John 16:33
    answerOptions: [
        { answerText: 'Tribulation', isCorrect: true },
        { answerText: 'Joy', isCorrect: false },
        { answerText: 'Money', isCorrect: false },
        { answerText: 'Hope', isCorrect: false },
    ],
    },
    {
    questionText: 'I sought the LORD, and He answered me and delivered me from all my _______. ', // Psalm 34:4–5, 8
    answerOptions: [
        { answerText: 'Vices', isCorrect: false },
        { answerText: 'Fears', isCorrect: true },
        { answerText: 'Problems', isCorrect: false },
        { answerText: 'Hate', isCorrect: false },
    ],
    },
    {
    questionText: 'And we know that for those who love God all things _________ for good...', // Romans 8:28
    answerOptions: [
        { answerText: 'Change', isCorrect: false },
        { answerText: 'Are Made', isCorrect: false },
        { answerText: 'Work Together', isCorrect: true },
        { answerText: 'Want', isCorrect: false },
    ],
    },
];

export {multipleChoiceQuestions, matchQuestions};