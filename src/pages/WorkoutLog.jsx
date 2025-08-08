import { useState, useEffect } from 'react';
import { Dumbbell, Plus } from 'lucide-react';
import Card from '../components/Card.jsx';
import { logWorkout, getTodaysWorkouts } from '../services/workoutService';

const WorkoutItem = ({ workout }) => (
  <Card className="!p-4 flex justify-between items-center">
    <div>
      <p className="font-bold">{workout.exercise_name}</p>
      <p className="text-sm text-text-secondary">{workout.sets} sets x {workout.reps} reps</p>
    </div>
    <p className="text-lg font-semibold">{workout.weight_kg} kg</p>
  </Card>
);

export default function WorkoutLog() {
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const fetchWorkouts = async () => {
    const workouts = await getTodaysWorkouts();
    setTodaysWorkouts(workouts);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!exerciseName) return;

    const workoutData = {
      exercise_name: exerciseName,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight_kg: parseFloat(weight) || 0
    };

    try {
      await logWorkout(workoutData);
      setExerciseName('');
      setSets('');
      setReps('');
      setWeight('');
      fetchWorkouts();
    } catch (error) {
      alert("Failed to log workout.");
    }
  };
  
  const inputStyles = "w-full px-4 py-2 bg-surface text-text-primary border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition";

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-3">
        <Dumbbell size={28} />
        <h1 className="text-3xl font-bold">Workout Log</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-text-secondary">Log an Exercise</h2>
          <input type="text" placeholder="Exercise Name" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} required className={inputStyles} />
          <div className="grid grid-cols-3 gap-2">
            <input type="number" placeholder="Sets" value={sets} onChange={(e) => setSets(e.target.value)} className={inputStyles} />
            <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} className={inputStyles} />
            <input type="number" step="0.5" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputStyles} />
          </div>
          <button type="submit" className="w-full py-3 flex items-center justify-center gap-2 rounded-lg font-semibold text-white transition bg-primary hover:bg-violet-700">
            <Plus size={20} /> Add Exercise
          </button>
        </form>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-3">Today's Session</h2>
        {loading ? <p>Loading workouts...</p> : (
            todaysWorkouts.length > 0 ? (
                <div className="space-y-3">
                    {todaysWorkouts.map(workout => <WorkoutItem key={workout.id} workout={workout} />)}
                </div>
            ) : <p className="text-text-secondary text-center py-4">No workouts logged today.</p>
        )}
      </div>
    </div>
  );
}