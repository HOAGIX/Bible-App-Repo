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

function formatBibleBook(currentBook, rawText, annotations = {}, highlightedVerses = {}) {
  const lines = rawText.split(/\r?\n/);
  let chapters = [];
  let currentChapter = null;
  let buffer = [];

  const normalizedBook = currentBook.replace(/\s+/g, "\\s*");

  const isChapterHeader = (line) => {
    const trimmed = line.trim();
    let bookPattern;

    const lowerBook = currentBook.toLowerCase();

    if (lowerBook === "psalms") {
      bookPattern = /^psalm[s]?\s*(\d+)/i;
    } else if (lowerBook === "song of solomon") {
      bookPattern = /^song of song[s]?\s*(\d+)/i;
    } else {
      const normalizedBook = currentBook.replace(/\s+/g, "\\s*");
      bookPattern = new RegExp(`^${normalizedBook}\\s*(\\d+)`, "i");
    }

    let match = trimmed.match(bookPattern);
    if (match) return match[1];

    match = trimmed.match(/^chapter\s+(\d+)$/i);
    if (match) return match[1];

    match = trimmed.match(/^(\d+)$/);
    if (match) return match[1];

    return null;
  };

  // Split book into chapters
  lines.forEach(line => {
    const chapterNum = isChapterHeader(line);
    if (chapterNum) {
      if (currentChapter) {
        chapters.push({ chapter: currentChapter, text: buffer.join(" ") });
      }
      currentChapter = chapterNum;
      buffer = [];
      return;
    }
    buffer.push(line.trim());
  });

  if (currentChapter) {
    chapters.push({ chapter: currentChapter, text: buffer.join(" ") });
  }

  // Verse regex: number immediately followed by text
  const verseRegex = /(\d+)([^\d\n][^]*?)(?=(\d+)|$)/gs;

  let fullHTML = "";
  chapters.forEach(ch => {
    fullHTML += `<h2>${currentBook} ${ch.chapter}</h2>`;
    let text = ch.text;
    let match;

    while ((match = verseRegex.exec(text)) !== null) {
      const verseNum = match[1];
      const verseText = match[2].trim();

      const verseKey = `${ch.chapter}:${verseNum}`;
      const note = annotations[currentBook]?.[verseKey] || "";
      const isHighlighted = highlightedVerses[currentBook]?.[verseKey] ? "highlighted" : "";

      fullHTML += `
        <div class="verse-line ${isHighlighted}" data-verse="${verseKey}">
          <span class="verse-number">${verseNum}</span> ${verseText}
          <button class="annotate-btn">✏️</button>
          ${note ? `<div class="verse-annotation">${note}</div>` : ""}
        </div>
      `;
    }
  });

  return fullHTML;
}


function BibleSection() {
  const [currentBook, setCurrentBook] = useState('Genesis'); 
  const [currentBookData, setCurrentBookData] = useState("No Data Loaded");

  const [annotations, setAnnotations] = useState(() => {
    return JSON.parse(localStorage.getItem('bibleAnnotations') || '{}');
  });

  const [highlightedVerses, setHighlightedVerses] = useState(() => {
    return JSON.parse(localStorage.getItem('highlightedVerses') || '{}');
  });

  // Add annotation
  const addAnnotation = (verseKey) => {
      const note = prompt("Enter your annotation:", annotations[currentBook]?.[verseKey] || "");
      if (note !== null) {
        setAnnotations(prev => {
          const updated = { ...prev };
          if (!updated[currentBook]) updated[currentBook] = {};
          updated[currentBook][verseKey] = note;
          localStorage.setItem("bibleAnnotations", JSON.stringify(updated));
          return updated;
        });
      }
  };

  // Toggle highlight
  const toggleHighlight = (verseKey) => {
    setHighlightedVerses(prev => {
      const updated = { ...prev };
      if (!updated[currentBook]) updated[currentBook] = {};

      if (updated[currentBook][verseKey]) {
        delete updated[currentBook][verseKey]; // remove highlight
      } else {
        updated[currentBook][verseKey] = true; // add highlight
      }

      localStorage.setItem("highlightedVerses", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const fetchBibleData = async () => {
      const response = await fetch(`Books/${currentBook}.txt`);
      const text = await response.text();
      const formattedData = formatBibleBook(currentBook, text, annotations, highlightedVerses);
      setCurrentBookData(formattedData);
    };

    fetchBibleData();
  }, [currentBook, annotations, highlightedVerses]);

  useEffect(() => {
    const bibleDiv = document.getElementById("Bible");
    if (!bibleDiv) return;

    const annotateButtons = bibleDiv.querySelectorAll(".annotate-btn");
    annotateButtons.forEach((btn) => {
      btn.onclick = () => {
        const verseDiv = btn.closest(".verse-line");
        const verseKey = verseDiv.dataset.verse;
        addAnnotation(verseKey);
      };
    });

    // Add click to toggle highlight
    const verses = bibleDiv.querySelectorAll(".verse-line");
    verses.forEach((verseDiv) => {
      verseDiv.onclick = (e) => {
        // prevent conflict with annotate button click
        if (e.target.classList.contains("annotate-btn")) return;
        const verseKey = verseDiv.dataset.verse;
        toggleHighlight(verseKey);
      };

      // Apply highlight class
      const verseKey = verseDiv.dataset.verse;
      if (highlightedVerses[currentBook]?.[verseKey]) {
        verseDiv.classList.add("highlighted");
      } else {
        verseDiv.classList.remove("highlighted");
      }
    });
  }, [currentBookData, highlightedVerses]);

  const scrollToTop = () => {
    const bibleDiv = document.getElementById("Bible");
    if (bibleDiv) bibleDiv.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNextBook = () => { addToIndex(); setCurrentBook(books[bookIndex]); scrollToTop(); };
  const goPrevBook = () => { subToIndex(); setCurrentBook(books[bookIndex]); scrollToTop(); };

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
        <li className='list-item'>
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
          <h4>{currentDevotion?.author || 'No author available'}</h4>
        </li>
    </div>
  );
}


export default App
