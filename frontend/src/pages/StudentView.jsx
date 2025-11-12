import React, { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material'
import { getCourses, getChaptersByCourse, getEnrollments, createEnrollment, getUsers } from '../services/api'

const StudentView = () => {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [chapters, setChapters] = useState([])
  const [openJoin, setOpenJoin] = useState(false)
  const [selectedCourseToJoin, setSelectedCourseToJoin] = useState(null)
  const [studentId, setStudentId] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadCourses()
    loadEnrollments()
    loadUsers()
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      loadChapters(selectedCourse.id)
    }
  }, [selectedCourse])

  const loadCourses = async () => {
    try {
      const response = await getCourses()
      setCourses(response.data.results || response.data || [])
    } catch (err) {
      console.log(err)
    }
  }

  const loadEnrollments = async () => {
    try {
      const response = await getEnrollments()
      setEnrollments(response.data.results || response.data || [])
    } catch (err) {
      console.log(err)
    }
  }

  const loadChapters = async (courseId) => {
    try {
      const response = await getChaptersByCourse(courseId)
      const allChapters = response.data.results || response.data || []
      // Only show public chapters
      const publicChapters = allChapters.filter(ch => ch.visibility === 'public')
      setChapters(publicChapters)
    } catch (err) {
      console.log(err)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await getUsers()
      const allUsers = response.data.results || response.data || []
      const students = allUsers.filter(u => u.username.includes('student'))
      setUsers(students)
      if (students.length > 0) {
        setStudentId(students[0].id)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleJoinCourse = async () => {
    if (!selectedCourseToJoin || !studentId) {
      alert('Please select a course and student')
      return
    }

    try {
      await createEnrollment({
        student: parseInt(studentId),
        course: parseInt(selectedCourseToJoin.id)
      })
      setOpenJoin(false)
      setSelectedCourseToJoin(null)
      loadEnrollments()
      alert('Successfully joined course!')
    } catch (err) {
      console.log(err)
      alert('Failed to join course: ' + (err.response?.data?.detail || err.message))
    }
  }

  const isEnrolled = (courseId) => {
    return enrollments.some(e => e.course === courseId && e.is_active)
  }

  const handleViewCourse = (course) => {
    if (!isEnrolled(course.id)) {
      setSelectedCourseToJoin(course)
      setOpenJoin(true)
    } else {
      setSelectedCourse(course)
    }
  }

  if (selectedCourse) {
    return (
      <Container maxWidth="lg">
        <Button onClick={() => setSelectedCourse(null)} sx={{ mb: 2 }}>Back to Courses</Button>
        <Typography variant="h4" gutterBottom>{selectedCourse.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {selectedCourse.description}
        </Typography>

        <Typography variant="h5" sx={{ mb: 2 }}>Chapters</Typography>
        {chapters.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No public chapters available yet.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {chapters.map((chapter) => (
              <Grid item xs={12} key={chapter.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{chapter.title}</Typography>
                    <Box
                      sx={{ mt: 2 }}
                      dangerouslySetInnerHTML={{ __html: chapter.content }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Student Dashboard</Typography>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Available Courses</Typography>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} key={course.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => handleViewCourse(course)}
                >
                  {isEnrolled(course.id) ? 'View Course' : 'Join Course'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openJoin} onClose={() => setOpenJoin(false)}>
        <DialogTitle>Join Course</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Join: {selectedCourseToJoin?.title}
          </Typography>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '8px' }}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoin(false)}>Cancel</Button>
          <Button onClick={handleJoinCourse} variant="contained">Join</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default StudentView
