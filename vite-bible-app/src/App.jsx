import Header from './components/Header'
import './App.css'
import { useState, useEffect } from 'react';

//#region books
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

  //#endregion
function App() {
  const [show, toggleShow] = useState('Home');
  const [bibleData, setData] = useState('No Data Available');
  
  useEffect(() => {
    const fetchBibleData = async () => {
      const response = await fetch(`Books/${books[65]}.txt`);
      const data = await response.text();
      setData(data);
    }

    fetchBibleData();
  }, []);

  return (
    <>
  
      
      <div>
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
          <div id='Bible' class='Center-Top'>
            {bibleData}
          </div>
        : ""}

        { show == 'Quiz' ? 
          <div id='Quiz'>

          </div>
        : ""}

        { show == 'Search' ? 
          <div id='Search'>

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

export default App
