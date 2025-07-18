
import { Routes, Route, useNavigate } from 'react-router-dom';
import MovieDetail from './pages/MovieDetail';
import Home from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/movie/:id" element={<MovieDetail />} />
    </Routes>
    
  );
}

export default App;
