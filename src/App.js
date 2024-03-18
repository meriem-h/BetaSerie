import './styles.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Connexion from './components/Connexion.js';
import Home from './components/Home.js';
import DiscoverShow from './components/discover_show.js'
import Profil from './components/Profil.js';
import Nav from './components/Nav.js';
import Detail_serie from './components/detail_serie.js'
import Search from './components/Search.js';
import Detail_episode from './components/detail_episode.js'

const API_KEY = process.env.REACT_APP_API_KEY
const API_SECRET_KEY = process.env.REACT_APP_API_SECRET_KEY

const urlAccessToken = "https://api.betaseries.com/members/access_token"

function App() {
  const [connected, setConnected] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');

  const token = localStorage.getItem('token');

  useEffect(() => {

    if (code) {

      fetch(`${urlAccessToken}`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
        body: `client_id=${API_KEY}&client_secret=${API_SECRET_KEY}&redirect_uri=http://localhost:3000/&code=${code}`
      })
      .then(res => res.json())
      .then(res => {
        if (res.token !== undefined) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('id_user', res.user.id);
          setConnected(true);
        }

      })
      .catch(err => console.error(err))
    }

    if (token && token !== "undefined") {
      fetch(`https://api.betaseries.com/members/is_active?key=${API_KEY}&token=${token}`, {
        method: 'GET',
        headers: new Headers(),
      })
      .then((res) => {
        if (res.status == 200) {
          setConnected(true);
        } else {
          setConnected(false);
          localStorage.removeItem('token');
        }
      })
      .catch(err => console.error(err))

    }

  }, [])


  return (
    <div className="App">
      <Router basename="/">
        {(connected) ?
          <>
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/DiscoverShow" element={<DiscoverShow />} />
              <Route path="/s_detail/:id" element={<Detail_serie />} />
              <Route path="/e_detail/:id" element={<Detail_episode />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </>
          :
          <>
            <Routes>
              <Route path="/" element={<Connexion />} />
            </Routes>
          </>
        }
      </Router>

    </div>
  );
}

export default App;
