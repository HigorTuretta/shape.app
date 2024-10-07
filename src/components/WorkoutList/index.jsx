// src/components/WorkoutList/index.jsx
import React, { useEffect, useState } from 'react'
import { db } from '@/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'
import { Card } from '@/components/ui/card'

const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([])

  useEffect(() => {
    const fetchWorkouts = async () => {
      const workoutSnapshot = await getDocs(collection(db, 'workouts'))
      const workoutList = workoutSnapshot.docs.map((doc) => doc.data())
      setWorkouts(workoutList)
    }

    fetchWorkouts()
  }, [])

  return (
    <ul className="space-y-4">
      {workouts.map((workout, index) => (
        <Card key={index}>
          <h3>{workout.exercise}</h3>
          <p>Weight: {workout.weight} kg</p>
          <p>Reps: {workout.reps}</p>
          {workout.videoUrl && (
            <a href={workout.videoUrl} target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
          )}
        </Card>
      ))}
    </ul>
  )
}

export default WorkoutList
