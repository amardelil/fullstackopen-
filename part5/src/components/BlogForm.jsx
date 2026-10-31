import { useState } from 'react'
import { TextField, Button, Stack } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const submit = async event => {
    event.preventDefault()
    await createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={submit} className="blogForm">
      <h3>Create a new blog</h3>
      <Stack spacing={2}>
        <TextField label="title" value={title} onChange={e => setTitle(e.target.value)} />
        <TextField label="author" value={author} onChange={e => setAuthor(e.target.value)} />
        <TextField label="url" value={url} onChange={e => setUrl(e.target.value)} />
        <Button type="submit" variant="contained">create</Button>
      </Stack>
    </form>
  )
}
export default BlogForm