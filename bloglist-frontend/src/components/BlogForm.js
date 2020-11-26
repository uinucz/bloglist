import React, { useState } from 'react'
//import blogService from '../services/blogs'

const BlogForm = ({ createBlog, setSuccessMessage }) => {
  const [newBlog, setNewBlog] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newBlog,
      author: newAuthor,
      url: newUrl,
      likes: newLikes,
    })

    setSuccessMessage('A new blog ' + newBlog + ' by ' + newAuthor + ' added')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 500)

    setNewBlog('')
    setNewAuthor('')
    setNewUrl('')
    setNewLikes(0)
  }

  return (
    <div className="formDiv">
      <h2>new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          titile:
          <input
            id="title"
            value={newBlog}
            onChange={({ target }) => setNewBlog(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            value={newAuthor}
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </div>
        <div>
          likes:
          <input
            id="likes"
            value={newLikes}
            onChange={({ target }) => setNewLikes(target.value)}
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
