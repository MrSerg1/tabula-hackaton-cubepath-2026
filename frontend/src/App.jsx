import { Routes, Route } from 'react-router-dom';

// import pages
import { Menu } from './pages/Menu.jsx';
import { Home } from './pages/Home.jsx';
import { MesaProvider } from './context/MesaContext.jsx';

function App() {
  return (
    <MesaProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </MesaProvider>
  )
}

export default App;
