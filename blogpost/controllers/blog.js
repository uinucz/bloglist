const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { update } = require('../models/blog')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer')){
//     return authorization.substring(7)
//   }
//   return null
// }

blogRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    }).populate('user')
    console.log('like 00000000000000000000000000000000', updatedBlog)
    response.send(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)
})

blogRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    //const user = await User.findById(decodedToken.id)

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === decodedToken.id.toString()) {
      try {
        await Blog.findByIdAndRemove(request.params.id)

        response.status(204).end()
      } catch (error) {
        next(error)
      }
    } else response.status(401).json({ error: 'wrong user' })
  } catch (error) {
    return response
      .status(401)
      .json({ error: 'token missing or invalid', 1: 'error occured' })
  }
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      likes: body.likes || 0,
      url: body.url,
      user: user,
    })

    console.log(1111111111111111111111111111111111111, blog)

    if (blog.title === undefined && blog.url === undefined)
      response.status(400).end()
    else {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      // Blog.find({})

      response.json(savedBlog.populate('user'))
    }
  } catch (error) {
    return response
      .status(401)
      .json({ error: 'token missing or invalid', 1: 'error occured' })
  }
})

module.exports = blogRouter
