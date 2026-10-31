import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { Container, Button } from '@mui/material'
import blogsService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogView from './components/BlogView'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()
  const navigate = useNavigate()

  const notify = (text, type = 'success') => {
    setNotification({ text, type })
    window.setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    blogsService.getAll().then(data => setBlogs(data)).catch(() => notify('Could not load blogs', 'error'))
  }, [])

  useEffect(() => {
    const savedUser = window.localStorage.getItem('loggedBloglistUser')
    if (savedUser) {
      const parsed = JSON.parse(savedUser)
      setUser(parsed)
      blogsService.setToken(parsed.token)
    }
  }, [])

  const login = async credentials => {
    try {
      const loggedIn = await loginService.login(credentials)
      blogsService.setToken(loggedIn.token)
      const tokenPayload = JSON.parse(atob(loggedIn.token.split('.')[1]))
      const userWithId = { ...loggedIn, id: tokenPayload.id }
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(userWithId))
      setUser(userWithId)
      notify(`Welcome ${loggedIn.name || loggedIn.username}`)
      navigate('/')
    } catch {
      notify('Wrong username or password', 'error')
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogsService.setToken(null)
    setUser(null)
    navigate('/')
    notify('Logged out')
  }

  const createBlog = async blogObject => {
    try {
      const created = await blogsService.create(blogObject)
      setBlogs(current => current.concat(created))
      blogFormRef.current?.hide()
      notify(`A new blog "${created.title}" added`)
      navigate('/')
    } catch {
      notify('Creating blog failed', 'error')
    }
  }

  const updateBlog = async updated => {
    try {
      const saved = await blogsService.update(updated.id, updated)
      setBlogs(current => current.map(blog => blog.id === saved.id ? saved : blog))
      notify('Blog updated')
    } catch {
      notify('Updating blog failed', 'error')
    }
  }

  const removeBlog = async blog => {
    try {
      await blogsService.remove(blog.id)
      setBlogs(current => current.filter(item => item.id !== blog.id))
      notify(`Blog "${blog.title}" removed`)
    } catch {
      notify('Removing blog failed', 'error')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <Container maxWidth="md">
      <header className="header">
        <h1>Blog List</h1>
        <nav>
          <Link to="/">blogs</Link>
          {user && <Link to="/create">create</Link>}
          {user
            ? <span>{user.name || user.username} logged in <Button onClick={logout}>logout</Button></span>
            : <Link to="/login">login</Link>}
        </nav>
      </header>

      <Notification notification={notification} />

      <Routes>
        <Route path="/" element={
          <section>
            <h2>Blogs</h2>
            {user && (
              <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={createBlog} />
              </Togglable>
            )}
            <div className="blogList">
              {sortedBlogs.map(blog =>
                <Blog key={blog.id} blog={blog} updateBlog={updateBlog}
                  removeBlog={removeBlog} user={user} />
              )}
            </div>
          </section>
        } />
        <Route path="/login" element={
          user ? <Navigate replace to="/" /> : <LoginForm onLogin={login} />
        } />
        <Route path="/create" element={
          user
            ? <BlogForm createBlog={createBlog} />
            : <Navigate replace to="/login" />
        } />
        <Route path="/blogs/:id" element={
          <BlogView blogs={blogs} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
        } />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </Container>
  )
}
export default App