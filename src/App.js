import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Main from './Components/Main';
import About from './Components/About';
import NoteState from './context/Notes/NoteState';
// import Alert from './Components/Alert';
import Login from './Components/Login';
import Signup from './Components/Signup';
import { useEffect } from 'react';
import { gapi } from 'gapi-script';

const clientID = "626564299693-oq31jjoh6lfvaucrhcgh1thclu377e1u.apps.googleusercontent.com";

function App() {
  useEffect(() => {
    const initClient = async () => {
      await gapi.load('client:auth2', async () => {
        await gapi.client.init({
          clientId: clientID,
          scope: "" 
        });
      });
    };

    initClient();
    return () => {
      // Add any necessary cleanup here
    };
  }, []);

  return (
    <>
      <NoteState>
        <BrowserRouter>
          <Navbar />
          {/* <Alert message="This is an alert" /> */}
          <div className="container">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
