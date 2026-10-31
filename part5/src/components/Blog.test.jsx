import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  id: 'abc123',
  title: 'Testing React components',
  author: 'Amar Delil',
  url: 'https://example.com/testing',
  likes: 7,
  user: { id: 'user1', name: 'Amar' }
}

const renderBlog = props => render(
  <MemoryRouter>
    <Blog blog={blog} updateBlog={vi.fn()} removeBlog={vi.fn()}
      user={{ id: 'user1', name: 'Amar' }} {...props} />
  </MemoryRouter>
)

test('5.13 title and author are shown, URL and likes are hidden initially', () => {
  const { container } = renderBlog()
  expect(screen.getByText('Testing React components')).toBeInTheDocument()
  expect(screen.getByText(/Amar Delil/)).toBeInTheDocument()
  expect(container).not.toHaveTextContent('https://example.com/testing')
  expect(container).not.toHaveTextContent('7')
})

test('5.14 URL and likes are shown after details button is clicked', async () => {
  const user = userEvent.setup()
  renderBlog()
  await user.click(screen.getByText('view'))
  expect(screen.getByText('https://example.com/testing')).toBeInTheDocument()
  expect(screen.getByText('7')).toBeInTheDocument()
})

test('5.15 like handler is called twice when like is clicked twice', async () => {
  const user = userEvent.setup()
  const updateBlog = vi.fn()
  renderBlog({ updateBlog })
  await user.click(screen.getByText('view'))
  await user.click(screen.getByText('like'))
  await user.click(screen.getByText('like'))
  expect(updateBlog).toHaveBeenCalledTimes(2)
})

test('5.16 blog form submits correct title, author and URL', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn().mockResolvedValue(undefined)
  const { default: BlogForm } = await import('./BlogForm')
  render(<BlogForm createBlog={createBlog} />)
  await user.type(screen.getByLabelText('title'), 'New test blog')
  await user.type(screen.getByLabelText('author'), 'Test Author')
  await user.type(screen.getByLabelText('url'), 'https://test.example')
  await user.click(screen.getByText('create'))
  expect(createBlog).toHaveBeenCalledWith({
    title: 'New test blog', author: 'Test Author', url: 'https://test.example'
  })
})