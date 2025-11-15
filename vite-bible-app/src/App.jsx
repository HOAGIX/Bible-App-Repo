import Header from './components/Header'
//import './App.css'
import './styles.css'
import { useState, useEffect } from 'react';
import questions from './quiz';

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
  
  const [currentBook, setCurrentBook] = useState('Genesis'); //Genesis as starting book
  const [trigger, setTrigger] = useState(true);
  const [currentBookData, setCurrentBookData] = useState("No Data Loaded");
  

  useEffect(() => {
    if(bookDataCache[bookIndex] !== undefined){
      setCurrentBookData(bookDataCache[bookIndex]);
      setTrigger(false);
      return;
    }
    const fetchBibleData = async () => {
      //Set to Revelation for testing
      const response = await fetch(`Books/${currentBook}.txt`);
      let text = await response.text();

     /* const pattern = new RegExp(`${currentBook}\\s*\\d+`, "g");
      const secondPattern = new RegExp(`(${currentBook}\\s*\\d+)\\s+(.*?)(?=\\s*\\d)`, "gi");
      let headerReplaced = text.replace(pattern, match => `<h2>${match}</h2>`);
      const data = headerReplaced.replace(secondPattern, match => `<h3>${match}</h3>`);
*/
      const pattern = new RegExp( // Creates a spacing between chapter, verses, and headers
        `(${currentBook}\\s*\\d+)\\s+(.*?)(?=\\d)`,
        "gis"
      );
      const data = text.replace(pattern, (match, p1, p2) => {
        return `<h2>${p1}</h2> <h3>${p2}</h3>`;
      });

      bookDataCache[bookIndex] = data;
      setCurrentBookData(bookDataCache[bookIndex]);
    }
    fetchBibleData();
    setTrigger(false);
  }, [trigger]);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [buttonStyles, setButtonStyles] = useState(Array(4).fill('#4a6fa5')); // initial color

  const checkQuestion = (index) => {
    const newStyles = [];

    if (questions[questionIndex].answerOptions[index].isCorrect) {
      newStyles[index] = 'green';
    } else {
      newStyles[index] = 'red';
    }

    setButtonStyles(newStyles);

    // reset after 1 second
    setTimeout(() => {
      setButtonStyles(Array(4).fill('#4a6fa5'));

      // move to next question
      setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
    }, 1000);
  };


  const GetQuiz = () => { 
    return (
      <div id='Quiz'>
        <h1 className='section-title'>Quiz Time!</h1>
        <h2 id='question' className='question'>{questions[questionIndex].questionText}</h2>
        <div id="answer-buttons">
          <button style={{backgroundColor: buttonStyles[0]}} className='answer-btn' onClick={() => checkQuestion(0)}>{questions[questionIndex].answerOptions[0].answerText}</button>
          <button style={{backgroundColor: buttonStyles[1]}}  className='answer-btn' onClick={() => checkQuestion(1)}>{questions[questionIndex].answerOptions[1].answerText}</button>
          <button style={{backgroundColor: buttonStyles[2]}}  className='answer-btn' onClick={() => checkQuestion(2)}>{questions[questionIndex].answerOptions[2].answerText}</button>
          <button style={{backgroundColor: buttonStyles[3]}} className='answer-btn' onClick={() => checkQuestion(3)}>{questions[questionIndex].answerOptions[3].answerText}</button>
        </div>
      </div>
    );
  }  

  return (
    <>
  
      
      <div className="Title">
        <Header/>
      </div>

      <div id='main' className="main">
        { show == 'Home' ?
          <div id='Home'>
              <li className='list-item'>
                Text
              </li>
              <li className='list-item'>
                Text
              </li>
              <li className='list-item'>
                Text
              </li>
              <li className='list-item'>
                Text
              </li>
              <li className='list-item'>
                Text
              </li>
          </div>
        : ""}

        { show == 'Bible' ? 
        <div className='Bible-Section'>
          <div id='Bible' className='Center-Top' dangerouslySetInnerHTML={{ __html: currentBookData }}>
          </div>
            <div className='Switch-Book'>
              <button onClick={() => {subToIndex(); setCurrentBook(books[bookIndex]); setTrigger(true);}}>⬅️</button>
              <h3>{currentBook}</h3>
              <button onClick={() => {addToIndex(); setCurrentBook(books[bookIndex]); setTrigger(true);}}>➡️</button>
            </div>
        </div>
        : ""}

        { show == 'Quiz' ? 
          { GetQuiz }      
        : ""}

        { show == 'Search' ? 
          <div id='Search'>
            Still Working On
          </div>
        : ""}


      </div>
      <footer>
        <button className='Menu-Item' onClick={() => toggleShow('Home')}>🏠</button>
        <button className='Menu-Item' onClick={() => toggleShow('Bible')}>📖</button>
        <button className='Menu-Item' onClick={() => {toggleShow('Quiz')}}>✅</button>
        <button className='Menu-Item' onClick={() => toggleShow('Search')}>🔍</button>
      </footer>
    </>
  )
}
//fetch('Test.txt') no need for other //'s because it is public 
function addToIndex() {
  if (bookIndex < books.length - 1) {
    bookIndex++;
  } else {
    bookIndex = 0;
  }

}
function subToIndex() {
  if (bookIndex > 0) {
    bookIndex--;
  } else {
    bookIndex = books.length - 1;
  }
}


export default App
