import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddMeal from './pages/AddMeal';
import Stats from './pages/Stats';
import BottomNav from './components/BottomNav';
import AuthPage from './pages/AuthPage';
import { Outlet } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import DarkToggle from './components/DarkToggle';
import Suggestions from './pages/Suggestions';
import Goals from './pages/Goals';
import WorkoutLog from './pages/WorkoutLog';
import Stats from './pages/Stats';

function App() {
  return (
    <Router>
      <div className="pb-20">
        <div className="pb-16"> {/* padding for nav */}
      <Outlet />
      <BottomNav />
    </div>
    <div className="pb-16">
      <DarkToggle />
      <Outlet />
      <BottomNav />
    </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddMeal />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/workouts" element={<WorkoutLog />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  );
}

export default App;