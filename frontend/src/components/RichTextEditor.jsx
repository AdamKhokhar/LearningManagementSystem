import React, { useMemo } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const RichTextEditor = ({ value, onChange, placeholder = "Start typing..." }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  }), [])

  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules}
      style={{ minHeight: '200px', marginBottom: '50px' }}
    />
  )
}

export default RichTextEditor

