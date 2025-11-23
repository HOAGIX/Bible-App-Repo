import Header from './components/Header';
import './styles.css';
import { useState, useEffect } from 'react';
import { multipleChoiceQuestions, matchQuestions } from './quiz';

//#region Bible Books
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
  "Jude", "Revelation"];
let bookIndex = 0;
let bookDataCache = [];
//#endregion

function App() {
  const [show, toggleShow] = useState('Home');
  const [currentBook, setCurrentBook] = useState('Genesis');
  const [currentBookData, setCurrentBookData] = useState("No Data Loaded");
  const [useMultipleChoice, setUseMultipleChoice] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [buttonStyles, setButtonStyles] = useState(Array(4).fill('#4a6fa5'));
  const [theme, setTheme] = useState("dark");

  // Fetch and format Bible text whenever currentBook changes
  useEffect(() => {
    const fetchBibleData = async () => {
      if (bookDataCache[currentBook]) {
        setCurrentBookData(bookDataCache[currentBook]);
        document.getElementById("Bible")?.scrollTo(0, 0);
        return;
      }

      const response = await fetch(`Books/${currentBook}.txt`);
      let text = await response.text();

      // Format chapters and verses
      const chapterPattern = new RegExp(`(${currentBook}\\s*\\d+)\\s+([\\s\\S]*?)(?=${currentBook}\\s*\\d+|$)`, "gi");

      const formatted = text.replace(chapterPattern, (match, chapterTitle, chapterText) => {
        const versesFormatted = chapterText.replace(/(\d+)\s/g, `<span class="verse-number">$1</span> `);
        return `<h2>${chapterTitle}</h2><div class="verse-block">${versesFormatted}</div>`;
      });

      bookDataCache[currentBook] = formatted;
      setCurrentBookData(formatted);
      document.getElementById("Bible")?.scrollTo(0, 0);
    };

    fetchBibleData();
  }, [currentBook]);

  const addToIndex = () => {
    bookIndex = (bookIndex + 1) % books.length;
    setCurrentBook(books[bookIndex]);
  };

  const subToIndex = () => {
    bookIndex = (bookIndex - 1 + books.length) % books.length;
    setCurrentBook(books[bookIndex]);
  };

  const checkQuestion = (index) => {
    const newStyles = [];
    const questions = useMultipleChoice ? multipleChoiceQuestions : matchQuestions;

    if (questions[questionIndex].answerOptions[index].isCorrect) {
      newStyles[index] = 'green';
    } else {
      newStyles[index] = 'red';
    }

    setButtonStyles(newStyles);

    setTimeout(() => {
      setButtonStyles(Array(4).fill('#4a6fa5'));
      setQuestionIndex((prev) => (prev + 1) % questions.length);
    }, 1000);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const ShowQuiz = () => {
    const questions = useMultipleChoice ? multipleChoiceQuestions : matchQuestions;
    return (
      <>
        <input type="checkbox" id="quiz-type" checked={useMultipleChoice} onChange={() => setUseMultipleChoice(!useMultipleChoice)} />
        <label htmlFor="quiz-type">Use Multiple Choice Questions</label>
        <h1 className='section-title'>Quiz Time!</h1>
        <h2 className='question'>{questions[questionIndex].questionText}</h2>
        <div id="answer-buttons">
          {questions[questionIndex].answerOptions.map((opt, idx) => (
            <button
              key={idx}
              style={{ backgroundColor: buttonStyles[idx] }}
              className='answer-btn'
              onClick={() => checkQuestion(idx)}
            >
              {opt.answerText}
            </button>
          ))}
        </div>
      </>
    );
  };

  // Fix iPhone viewport height
  useEffect(() => {
    const updateIosVh = () => document.documentElement.style.setProperty("--ios-vh", window.innerHeight * 0.01);
    updateIosVh();
    window.addEventListener("resize", updateIosVh);
    return () => window.removeEventListener("resize", updateIosVh);
  }, []);

  return (
    <div className={`body ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <div id='main' className="main">
        {show === 'Home' &&
          <div id='Home'>
            <div className="Title">
              <Header />
            </div>
            {Array(5).fill(0).map((_, i) => <li key={i} className='list-item'>Text</li>)}
          </div>
        }

        {show === 'Bible' &&
          <div className='Bible-Section'>
            <div id='Bible' className='Center-Top' dangerouslySetInnerHTML={{ __html: currentBookData }} />
            <div className='Switch-Book'>
              <button onClick={subToIndex}>⬅️</button>
              <h3>{currentBook}</h3>
              <button onClick={addToIndex}>➡️</button>
            </div>
          </div>
        }

        {show === 'Quiz' &&
          <div id='Quiz'>
            <label className="checkbox-container">
              <input type="checkbox" onChange={() => setUseMultipleChoice(!useMultipleChoice)} />
              <span className="checkmark"></span>
              Multiple Choice Questions
            </label>
            {ShowQuiz()}
          </div>
        }

        {show === 'More' &&
          <div id='More'>
            More Section
          </div>
        }
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

export default App;
