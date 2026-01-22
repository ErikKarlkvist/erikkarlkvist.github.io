import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ExploreComponents from './pages/ExploreComponents';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/explore-components" element={<ExploreComponents />} />
      </Routes>
    </HashRouter>
  )
}

export default App
