import React, { useState, useEffect } from 'react'
import { Container, Typography, Card, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { getCourses, createCourse, getChaptersByCourse, createChapter, updateChapter, deleteChapter, getUsers } from '../services/api'
import RichTextEditor from '../components/RichTextEditor'

const TeacherView = () => {
  const [courses, setCourses] = useState([])
  const [chapters, setChapters] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [openCourse, setOpenCourse] = useState(false)
  const [openChapter, setOpenChapter] = useState(false)
  const [editingChapter, setEditingChapter] = useState(null)
  const [users, setUsers] = useState([])
  
  // Course form state
  const [courseTitle, setCourseTitle] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [instructorId, setInstructorId] = useState('')
  
  // Chapter form state
  const [chapterTitle, setChapterTitle] = useState('')
  const [chapterContent, setChapterContent] = useState('')
  const [chapterVisibility, setChapterVisibility] = useState('private')
  const [selectedCourseForChapter, setSelectedCourseForChapter] = useState('')

  useEffect(() => {
    loadCourses()
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
      const coursesList = response.data.results || response.data || []
      setCourses(coursesList)
      if (coursesList.length > 0 && !selectedCourseForChapter) {
        setSelectedCourseForChapter(coursesList[0].id)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const loadChapters = async (courseId) => {
    try {
      const response = await getChaptersByCourse(courseId)
      setChapters(response.data.results || response.data || [])
    } catch (err) {
      console.log(err)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await getUsers()
      const allUsers = response.data.results || response.data || []
      const instructors = allUsers.filter(u => u.username.includes('teacher') || u.username.includes('admin'))
      setUsers(instructors)
      if (instructors.length > 0) {
        setInstructorId(instructors[0].id)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreateCourse = async () => {
    if (!courseTitle.trim() || !instructorId) {
      alert('Please fill in all fields')
      return
    }

    try {
      await createCourse({
        title: courseTitle.trim(),
        description: courseDescription.trim() || 'No description',
        instructor: parseInt(instructorId)
      })
      setOpenCourse(false)
      setCourseTitle('')
      setCourseDescription('')
      loadCourses()
      alert('Course created successfully!')
    } catch (err) {
      console.log(err)
      alert('Failed to create course')
    }
  }

  const handleCreateChapter = async () => {
    if (!chapterTitle.trim() || !selectedCourseForChapter || !chapterContent.trim()) {
      alert('Please fill in all fields')
      return
    }

    try {
      const data = {
        course: parseInt(selectedCourseForChapter),
        title: chapterTitle.trim(),
        content: chapterContent,
        visibility: chapterVisibility
      }

      if (editingChapter) {
        await updateChapter(editingChapter.id, data)
        alert('Chapter updated successfully!')
      } else {
        await createChapter(data)
        alert('Chapter created successfully!')
      }
      
      setOpenChapter(false)
      setChapterTitle('')
      setChapterContent('')
      setChapterVisibility('private')
      setEditingChapter(null)
      
      if (selectedCourse) {
        loadChapters(selectedCourse.id)
      }
      loadCourses()
    } catch (err) {
      console.log(err)
      alert('Failed to save chapter')
    }
  }

  const handleEditChapter = (chapter) => {
    setEditingChapter(chapter)
    setChapterTitle(chapter.title)
    setChapterContent(chapter.content)
    setChapterVisibility(chapter.visibility)
    setSelectedCourseForChapter(chapter.course)
    setOpenChapter(true)
  }

  const handleDeleteChapter = async (id) => {
    if (window.confirm('Delete this chapter?')) {
      try {
        await deleteChapter(id)
        if (selectedCourse) {
          loadChapters(selectedCourse.id)
        }
      } catch (err) {
        alert('Failed to delete chapter')
      }
    }
  }

  const handleNewChapter = () => {
    setEditingChapter(null)
    setChapterTitle('')
    setChapterContent('')
    setChapterVisibility('private')
    if (courses.length > 0) {
      setSelectedCourseForChapter(courses[0].id)
    }
    setOpenChapter(true)
  }

  if (selectedCourse) {
    return (
      <Container maxWidth="lg">
        <Button onClick={() => setSelectedCourse(null)} sx={{ mb: 2 }}>Back to Courses</Button>
        <Typography variant="h4" gutterBottom>{selectedCourse.title}</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {selectedCourse.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Button variant="contained" onClick={handleNewChapter}>
            Add Chapter
          </Button>
        </Box>

        <Typography variant="h5" sx={{ mb: 2 }}>Chapters</Typography>
        {chapters.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No chapters yet. Click "Add Chapter" to create one.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {chapters.map((chapter) => (
              <Grid item xs={12} key={chapter.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6">{chapter.title}</Typography>
                      <Box>
                        <Typography variant="caption" sx={{ mr: 2 }}>
                          Visibility: {chapter.visibility}
                        </Typography>
                        <Button size="small" onClick={() => handleEditChapter(chapter)} sx={{ mr: 1 }}>
                          Edit
                        </Button>
                        <Button size="small" color="error" onClick={() => handleDeleteChapter(chapter.id)}>
                          Delete
                        </Button>
                      </Box>
                    </Box>
                    <Box
                      dangerouslySetInnerHTML={{ __html: chapter.content }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openChapter} onClose={() => setOpenChapter(false)} maxWidth="md" fullWidth>
          <DialogTitle>{editingChapter ? 'Edit Chapter' : 'Create Chapter'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Course"
              select
              value={selectedCourseForChapter}
              onChange={(e) => setSelectedCourseForChapter(e.target.value)}
              sx={{ mt: 2 }}
              required
            >
              {courses.map(course => (
                <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Chapter Title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              sx={{ mt: 2 }}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>Content</Typography>
              <RichTextEditor
                value={chapterContent}
                onChange={setChapterContent}
                placeholder="Enter chapter content..."
              />
            </Box>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Visibility</InputLabel>
              <Select
                value={chapterVisibility}
                onChange={(e) => setChapterVisibility(e.target.value)}
                label="Visibility"
              >
                <MenuItem value="public">Public</MenuItem>
                <MenuItem value="private">Private</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenChapter(false)}>Cancel</Button>
            <Button onClick={handleCreateChapter} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Instructor Dashboard</Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenCourse(true)} sx={{ mr: 2 }}>
          Create Course
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>My Courses</Typography>
      {courses.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No courses yet. Click "Create Course" to get started.
        </Typography>
      ) : (
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
                    onClick={() => setSelectedCourse(course)}
                  >
                    Manage Chapters
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openCourse} onClose={() => setOpenCourse(false)}>
        <DialogTitle>Create Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Course Title"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            sx={{ mt: 2 }}
            required
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Instructor"
            select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            sx={{ mt: 2 }}
            required
          >
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCourse(false)}>Cancel</Button>
          <Button onClick={handleCreateCourse} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default TeacherView
