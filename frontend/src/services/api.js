import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

export const getCourses = () => {
  return api.get('/courses/')
}

export const createCourse = (data) => {
  return api.post('/courses/', data)
}

export const updateCourse = (id, data) => {
  return api.patch(`/courses/${id}/`, data)
}

export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}/`)
}

export const getChapters = () => {
  return api.get('/chapters/')
}

export const getChaptersByCourse = (courseId) => {
  return api.get(`/chapters/?course=${courseId}`)
}

export const createChapter = (data) => {
  return api.post('/chapters/', data)
}

export const updateChapter = (id, data) => {
  return api.patch(`/chapters/${id}/`, data)
}

export const deleteChapter = (id) => {
  return api.delete(`/chapters/${id}/`)
}

export const getUsers = () => {
  return api.get('/users/')
}

export const createEnrollment = (data) => {
  return api.post('/enrollments/', data)
}

export const deleteEnrollment = (id) => {
  return api.delete(`/enrollments/${id}/`)
}

export const getEnrollments = () => {
  return api.get('/enrollments/')
}
