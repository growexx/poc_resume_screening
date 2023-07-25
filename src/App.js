import './App.css';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import FileUpload from './Components/FileUpload';
import ResumeData from './Components/ResumeData';
function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<FileUpload />}/>
        <Route path='/result' element={<ResumeData/>}/>

      </Routes>
     
    </div>
    </Router>
  );
}

export default App;
