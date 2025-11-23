import Header from './components/Header'
//import './App.css'
import './styles.css'
import { useState, useEffect, use } from 'react';
import {multipleChoiceQuestions, matchQuestions} from './quiz';
import React from 'react';
import ReactPlayer from 'react-player';

import { Devotion } from './classes.jsx';

//#region books From https://trulyfreebible.com/
const books = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
  "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations",
  "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts",
  "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy",
  "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John",
  "Jude", "Revelation"]

  let bookIndex = 0;
  //#endregion
let bookDataCache = [];

function App() {
  const [show, toggleShow] = useState('Home');
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className={`body ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>

      <div id='main' className="main">
        {show === 'Home' && <Mainsection />}
        {show === 'Bible' && <BibleSection />}
        {show === 'Quiz' && <QuizSection />}
        {show === 'More' && <div id='More'>More Section</div>}
      </div>

      <footer>
        <button className='Menu-Item' onClick={() => toggleShow('Home')}>🏠</button>
        <button className='Menu-Item' onClick={() => toggleShow('Bible')}>📖</button>
        <button className='Menu-Item' onClick={() => toggleShow('Quiz')}>✅</button>
        <button className='Menu-Item' onClick={() => toggleShow('More')}>📶</button>
      </footer>
    </div>
  );
}
// region Bible Section
function BibleSection() {
  const [currentBook, setCurrentBook] = useState('Genesis'); 
  const [currentBookData, setCurrentBookData] = useState("No Data Loaded");

  useEffect(() => {
    const fetchBibleData = async () => {
      if (bookDataCache[bookIndex]) {
        setCurrentBookData(bookDataCache[bookIndex]);
        scrollToTop();
        return;
      }

      const response = await fetch(`Books/${currentBook}.txt`);
      const text = await response.text();

      // Regex for chapter + verses formatting
      const pattern = new RegExp(
        `(${currentBook}\\s*\\d+)\\s+(.*?)(?=\\d)`,
        "gis"
      );

      const formattedData = text
        .replace(pattern, (match, p1, p2) => {
          return `<h2>${p1}</h2><div class="verse-block">${p2}</div>`;
        })
        .replace(/(\d+)(?=\s)/g, `<span class="verse-number">$1</span>`);

      bookDataCache[bookIndex] = formattedData;
      setCurrentBookData(formattedData);

      scrollToTop();
    };

    fetchBibleData();
  }, [currentBook]);

  const scrollToTop = () => {
    const bibleDiv = document.getElementById("Bible");
    if (bibleDiv) bibleDiv.scrollTop = 0;
  };

  const goNextBook = () => {
    addToIndex();
    setCurrentBook(books[bookIndex]);
  };

  const goPrevBook = () => {
    subToIndex();
    setCurrentBook(books[bookIndex]);
  };

  return (
    <div className='Bible-Section'>
      <div 
        id='Bible' 
        className='Center-Top' 
        dangerouslySetInnerHTML={{ __html: currentBookData }}
      />
      <div className='Switch-Book'>
        <button onClick={goPrevBook}>⬅️</button>
        <h3>{currentBook}</h3>
        <button onClick={goNextBook}>➡️</button>
      </div>
    </div>
  );
}



// Navigation helpers
function addToIndex() {
  if (bookIndex < books.length - 1) bookIndex++;
  else bookIndex = 0;
}

function subToIndex() {
  if (bookIndex > 0) bookIndex--;
  else bookIndex = books.length - 1;
}

// endregion
function QuizSection() {
  const [useMultipleChoice, setUseMultipleChoice] = useState(true);

  const ShowQuiz = () => {
    return (
      <> 
        <input type="checkbox" id="quiz-type" checked={useMultipleChoice} onChange={() => setUseMultipleChoice(!useMultipleChoice)} />
          <label htmlFor="quiz-type">Use Multiple Choice Questions</label>
      </>,

       useMultipleChoice == true ? (
        <>
          <h1 className='section-title'>Quiz Time!</h1>
          <h2 id='question' style={{fontSize: 'x-large'}} className='question'>{multipleChoiceQuestions[questionIndex].questionText}</h2>
          <div id="answer-buttons">
            <button style={{backgroundColor: buttonStyles[0]}} className='answer-btn' onClick={() => checkQuestion(0)}>{multipleChoiceQuestions[questionIndex].answerOptions[0].answerText}</button>
            <button style={{backgroundColor: buttonStyles[1]}}  className='answer-btn' onClick={() => checkQuestion(1)}>{multipleChoiceQuestions[questionIndex].answerOptions[1].answerText}</button>
            <button style={{backgroundColor: buttonStyles[2]}}  className='answer-btn' onClick={() => checkQuestion(2)}>{multipleChoiceQuestions[questionIndex].answerOptions[2].answerText}</button>
            <button style={{backgroundColor: buttonStyles[3]}} className='answer-btn' onClick={() => checkQuestion(3)}>{multipleChoiceQuestions[questionIndex].answerOptions[3].answerText}</button>
          </div>
        </>
      ) : (
      <>
          <h1 className='section-title'>Quiz Time!</h1>
          <h2 id='question' style={{fontSize: 'large'}} className='question'>{matchQuestions[questionIndex].questionText}</h2>
          <div id="answer-buttons">
            <button style={{backgroundColor: buttonStyles[0]}} className='answer-btn' onClick={() => checkQuestion(0)}>{matchQuestions[questionIndex].answerOptions[0].answerText}</button>
            <button style={{backgroundColor: buttonStyles[1]}}  className='answer-btn' onClick={() => checkQuestion(1)}>{matchQuestions[questionIndex].answerOptions[1].answerText}</button>
            <button style={{backgroundColor: buttonStyles[2]}}  className='answer-btn' onClick={() => checkQuestion(2)}>{matchQuestions[questionIndex].answerOptions[2].answerText}</button>
            <button style={{backgroundColor: buttonStyles[3]}} className='answer-btn' onClick={() => checkQuestion(3)}>{matchQuestions[questionIndex].answerOptions[3].answerText}</button>
          </div>
      </>
      )

    );
  }
  const checkQuestion = (index) => {
    const newStyles = [];

    if(useMultipleChoice){
      if (multipleChoiceQuestions[questionIndex].answerOptions[index].isCorrect) {
        newStyles[index] = 'green';
      } else {
        newStyles[index] = 'red';
      }
      } else {
          if (matchQuestions[questionIndex].answerOptions[index].isCorrect) {
            newStyles[index] = 'green';
          } else {
            newStyles[index] = 'red';
          }
      }
      

    setButtonStyles(newStyles);

    // reset after 1 second
    setTimeout(() => {
      setButtonStyles(Array(4).fill('#4a6fa5'));

      // move to next question
      setQuestionIndex((prevIndex) => (prevIndex + 1) % multipleChoiceQuestions.length);
    }, 1000);
  };

  
  const [questionIndex, setQuestionIndex] = useState(0);

  const [buttonStyles, setButtonStyles] = useState(Array(4).fill('#4a6fa5')); // initial color


  return (
    <div id='Quiz'>
      <label class="checkbox-container">
        <input type="checkbox" onChange={() => setUseMultipleChoice(!useMultipleChoice)}/>
        <span class="checkmark"></span>
        Use Fill in the Blank Questions
      </label>
      {ShowQuiz()}
    </div>
  );
}

function Mainsection() {
  const [devotions, setDevotions] = useState([]);
  const [devotionIndex, setDevotionIndex] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async (formId, apiKey) => {
      try {
        const response = await fetch(
          `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`
        );
        const data = await response.json();

        console.log("Jotform API Response:", data);

        if (!data.content) {
          console.error("No submissions found in the response.");
          return;
        }

        const approvedDevotions = data.content
          .filter(
            sub =>
              (sub.status === "ACTIVE" || sub.status === "CUSTOM") &&
              sub.answers &&
              sub.answers['15']?.answer === "Approved"
          )
          .map(submission => {
            const purpose = submission.answers['10']?.answer || '';
            let videoAnswer = submission.answers['22']?.answer || '';
            const writtentext = submission.answers['5']?.answer || '';
            const prayer = submission.answers['7']?.answer || '';
            const author = "By: " + submission.answers['20']?.answer || '';

            // If it's an array (Jotform file upload), pick the first item
            if (Array.isArray(videoAnswer)) videoAnswer = videoAnswer[0];

            // If it's a relative file path, prepend Jotform CDN
            if (videoAnswer && !videoAnswer.startsWith('http')) {
              videoAnswer = `https://cdn.jotfor.ms/files/${videoAnswer}`;
            }

            return new Devotion(purpose, videoAnswer, writtentext, prayer, author);
          });

        console.log("Approved Devotions:", approvedDevotions);
        setDevotions(approvedDevotions);

      } catch (error) {
        console.error("Error fetching Jotform submissions:", error);
      }
    };

    fetchSubmissions(import.meta.env.VITE_FORM_ID, import.meta.env.VITE_API_KEY);
  }, []);

  if (!devotions.length) {
    return <p>Loading devotions...</p>;
  }

  const currentDevotion = devotions[devotionIndex];

  return (
    <div id="Home">
      <div className="Title">
        <Header />
      </div>
        <li className='list-item'>
          <h3>{currentDevotion?.purpose || 'No purpose available'}</h3>
        </li>
        <li className='list-item' style={{ listStyle: 'none', width: '100%' }}>
          <div style={{ width: '100%', maxWidth: '640px', margin: '20px auto' }}>
            {currentDevotion?.video ? (
              <ReactPlayer
                key={currentDevotion.video}
                src={currentDevotion?.video || null}
                alt="Devotion Video"
                width="100%"
                height="240px"
                controls
              />
            ) : (
              <p>No video available</p>
            )}
          </div>
        </li>
        <li className='list-item'>
          <div dangerouslySetInnerHTML={{ __html: currentDevotion?.writtentext || 'No written text' }} />
        </li>
        <li className='list-item'>
          {currentDevotion?.prayer || 'No prayer available'}
        </li>
        <li className='list-item'>
          {currentDevotion?.author || 'No author available'}
        </li>
    </div>
  );
}


export default App
