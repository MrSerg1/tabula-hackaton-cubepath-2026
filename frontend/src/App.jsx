import { Routes, Route } from 'react-router-dom';

// import pages
import { Home } from './pages/Home';
import { Login } from './pages/Cart';
import { MesaProvider } from './context/MesaContext';

function App() {
  return (
    <MesaProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </MesaProvider>
  )
}

export default App;
