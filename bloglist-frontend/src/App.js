import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Success from './components/Success'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

//login bake parol sake

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(sortByLikes(blogs)))
    console.log(blogs)
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage('login confirmed')
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }

    console.log('logging in with', username, password)
  }

  const handleLogout = () => setUser(null)

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then((returnedNote) => {
      setBlogs(sortByLikes(blogs.concat(returnedNote)))
    })
  }

  const deleteBlog = async (id) => {
    const toBeDeleted = blogs.find((n) => n.id === id)
    if (
      window.confirm(
        `Remove blog ${toBeDeleted.title} by ${toBeDeleted.author}`
      )
    ) {
      await blogService.deleteIt(id)
      await blogService.getAll().then((blogs) => setBlogs(sortByLikes(blogs)))
      setSuccessMessage(`${toBeDeleted.title} deleted`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 2000)
    }
  }

  const blogFormRef = React.useRef()

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} setSuccessMessage={setSuccessMessage} />
    </Togglable>
  )

  const sortByLikes = (unsortedBlogs) => {
    const x = [...unsortedBlogs].sort((a, b) => {
      if (a.likes < b.likes) return -1
      if (a.likes > b.likes) return 1
      else return 0
    })
    return x
  }

  const addLike = (id) => {
    const blog = blogs.find((n) => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(
          sortByLikes(
            blogs.map((blog) => (blog.id !== id ? blog : returnedBlog))
          )
        )
      })
      .catch((error) => {
        setErrorMessage(
          `Blog ${blog.title} was already removed from server ${error}`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  return (
    <div>
      <h2>BLOGS</h2>

      <Notification message={errorMessage} />
      <Success message={successMessage} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p> {user.username} logged </p>

          <button onClick={handleLogout}>logout</button>

          {blogForm()}

          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={addLike}
              deleteBlog={deleteBlog}
              userIsAuthor={blog.user.username === user.username}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
