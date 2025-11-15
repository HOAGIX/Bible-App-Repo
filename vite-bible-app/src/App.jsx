import Header from './components/Header'
//import './App.css'
import './styles.css'
import { useState, useEffect } from 'react';

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
      const pattern = new RegExp(`${currentBook}\\s*\\d+`, "g");


      const data = text.replace(pattern, match => `<h2>${match}</h2>`);
      bookDataCache[bookIndex] = data;
      setCurrentBookData(bookDataCache[bookIndex]);
    }
    fetchBibleData();
    setTrigger(false);
  }, [trigger]);

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
          <div id='Quiz'>
            Still Working On
          </div>
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
        <button className='Menu-Item' onClick={() => toggleShow('Quiz')}>✅</button>
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
