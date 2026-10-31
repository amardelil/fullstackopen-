import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const ownerId = blog.user?.id || blog.user?._id
  const currentUserId = user?.id || user?._id
  const isOwner = ownerId && currentUserId && ownerId === currentUserId

  const like = () => updateBlog({ ...blog, likes: blog.likes + 1 })
  const remove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog)
    }
  }

  return (
    <div className="blog" data-testid="blog">
      <div className="blogSummary">
        <Link to={`/blogs/${blog.id}`} className="blogTitle">
          {blog.title}
        </Link>
        <span> by {blog.author}</span>
        <button onClick={() => setDetailsVisible(!detailsVisible)}>
          {detailsVisible ? 'hide' : 'view'}
        </button>
      </div>
      {detailsVisible && (
        <div className="blogDetails">
          <p>{blog.url}</p>
          <p>likes <span className="likes">{blog.likes}</span></p>
          <button onClick={like}>like</button>
          <p>{blog.user?.name || blog.user?.username || 'Unknown user'}</p>
          {isOwner && <button onClick={remove}>remove</button>}
        </div>
      )}
    </div>
  )
}
export default Blog