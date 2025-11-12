import React, { useState } from 'react'
import { Container, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import StudentView from './StudentView'
import TeacherView from './TeacherView'

const Home = () => {
  const [role, setRole] = useState('student')

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" gutterBottom>LMS</Typography>
        <Typography variant="h6" sx={{ mb: 3 }}>Learning Management System</Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>I am a...</InputLabel>
          <Select
            value={role}
            label="I am a..."
            onChange={(e) => setRole(e.target.value)}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Instructor</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {role === 'student' ? <StudentView /> : <TeacherView />}
    </Container>
  )
}

export default Home
