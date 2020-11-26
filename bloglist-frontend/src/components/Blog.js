import React, { useState } from 'react'
//import blogs from '../services/blogs'

const Blog = ({ blog, addLike, deleteBlog, userIsAuthor }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [show, setShow] = useState(false)

  return (
    <div>
      {show ? (
        <div style={blogStyle} className="revealed">
          {blog.title}
          <button onClick={() => setShow(!show)}>hide</button> <br />
          {blog.author}
          <br />
          {blog.url} <br />
          <p className="likes">{blog.likes} </p>{' '}
          <button onClick={() => addLike(blog.id)}>like</button>
          <br />{' '}
          {/* <p>            Created by <b>{blog.user.username}</b>{' '}          </p> */}
          <br />
          {userIsAuthor && (
            <button onClick={() => deleteBlog(blog.id)}>delete</button>
          )}
        </div>
      ) : (
        <div style={blogStyle} className="titleAndAuthor">
          <div>
            {blog.title} {blog.author}
            <button onClick={() => setShow(!show)}>view</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
