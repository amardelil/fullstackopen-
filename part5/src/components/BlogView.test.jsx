import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import BlogView from './BlogView'

const blog = {
  id: 'blog1',
  title: 'A blog about testing',
  author: 'Test Author',
  url: 'https://testing.example',
  likes: 4,
  user: { id: 'owner1', name: 'Blog Owner' }
}

const renderView = user => render(
  <MemoryRouter initialEntries={['/blogs/blog1']}>
    <Routes>
      <Route path="/blogs/:id" element={
        <BlogView blogs={[blog]} updateBlog={vi.fn()} removeBlog={vi.fn()} user={user} />
      } />
    </Routes>
  </MemoryRouter>
)

test('5.27 unauthenticated visitor sees blog details but no action buttons', () => {
  renderView(null)
  expect(screen.getByText('A blog about testing — Test Author')).toBeInTheDocument()
  expect(screen.getByText('likes 4')).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('5.27 authenticated non-owner sees like but not delete', () => {
  renderView({ id: 'reader1', name: 'Reader' })
  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})

test('5.27 blog creator sees like and delete buttons', () => {
  renderView({ id: 'owner1', name: 'Blog Owner' })
  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
})
