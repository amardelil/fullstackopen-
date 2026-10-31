import { useNavigate, useParams } from 'react-router-dom'

const BlogView = ({ blogs, updateBlog, removeBlog, user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const blog = blogs.find(item => item.id === id)

  if (!blog) return <p>Blog not found or still loading.</p>

  const ownerId = blog.user?.id || blog.user?._id
  const currentUserId = user?.id || user?._id
  const isOwner = ownerId && currentUserId && ownerId === currentUserId

  const like = () => updateBlog({ ...blog, likes: blog.likes + 1 })
  const remove = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await removeBlog(blog)
      navigate('/')
    }
  }

  return (
    <section className="blogView">
      <h2>{blog.title} — {blog.author}</h2>
      <a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a>
      <p>likes {blog.likes}</p>
      {user && <button onClick={like}>like</button>}
      <p>added by {blog.user?.name || blog.user?.username || 'Unknown user'}</p>
      {isOwner && <button onClick={remove}>remove</button>}
    </section>
  )
}
export default BlogView