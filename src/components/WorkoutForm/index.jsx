// src/components/WorkoutForm/index.jsx
import React, { useState } from 'react'
import { db } from '@/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const WorkoutForm = () => {
  const [exercise, setExercise] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [note, setNote] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const workoutData = { exercise, weight, reps, note, videoUrl }
    await addDoc(collection(db, 'workouts'), workoutData)
    setExercise('')
    setWeight('')
    setReps('')
    setNote('')
    setVideoUrl('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Exercise Name"
        value={exercise}
        onChange={(e) => setExercise(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Notes (Optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Input
        type="url"
        placeholder="YouTube Video URL (Optional)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <Button type="submit" className="w-full">Add Exercise</Button>
    </form>
  )
}

export default WorkoutForm
