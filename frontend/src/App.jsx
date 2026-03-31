import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sileo';

// import pages
import { Waiter } from './pages/Waiter.jsx';
import { Menu } from './pages/Menu.jsx';
import { Home } from './pages/Home.jsx';
import { MesaProvider } from './context/MesaContext.jsx';

function App() {
  return (
    <MesaProvider>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/waiter" element={<Waiter />} />
      </Routes>
    </MesaProvider>
  )
}

export default App;
