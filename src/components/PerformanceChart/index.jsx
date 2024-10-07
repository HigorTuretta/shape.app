// src/components/PerformanceChart/index.jsx
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { day: 'Mon', weight: 50, reps: 10 },
  { day: 'Tue', weight: 55, reps: 12 },
  { day: 'Wed', weight: 60, reps: 8 },
]

const PerformanceChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="weight" stroke="#8884d8" />
      <Line type="monotone" dataKey="reps" stroke="#82ca9d" />
    </LineChart>
  </ResponsiveContainer>
)

export default PerformanceChart
