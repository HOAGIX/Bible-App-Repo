import Header from './components/Header'
import './App.css'
import { useState } from 'react';


function App() {
  const [show, toggleShow] = useState('Home');

  
  return (
    <>
  
      
      <div className="FadeIn">
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
          <div id='Bible'>
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
//fetch('Test.txt') no need for other //'s because it is public 



export default App
