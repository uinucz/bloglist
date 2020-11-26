const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const Blog = require('../models/blog')

let initialLength = 0
beforeEach(async () => {
    initialLength = await Blog.countDocuments({})
})

const api = supertest(app)

test("notes are returned as json", async () => {
  const response = await api.get("/api/blogs")

  expect(response.body).toHaveLength(4)
})

test("verify id", async () => {
  const response = await api.get("/api/blogs")

  const x = response.body[0].id
  console.log("THIS IS WHAT I NEED", x)

  expect(response.body[0].id).toBeDefined()
})

test('new blog post code word logan', async () => {
    const newBlog = {
        author: 'Harry potter',
        title: 'j k rowling',
        url: 'google.com/etc',
        
    }

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJha2UiLCJpZCI6IjVmYWJjZTBkNzYzMDI4MjExNDU2OGRkMSIsImlhdCI6MTYwNTA5NzcwOH0.n2GtMg2WdL8Kkn3kRuIVdi4AAQqdNOjLrNtBdnOWoyA'
    await api
                .post('/api/blogs')
                .set({ authorization: `bearer ${token}`})
                .send(newBlog)                
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')



    const contents = response.body.map(r => r.author)
    expect(response.body).toHaveLength(initialLength + 1)
   
    expect(contents).toContain('Harry potter')
})

test('adding blog fails', async () => {
  const newBlog = {
      author: 'Harry potter',
      title: 'j k rowling',
      url: 'google.com/etc',
      
  }

  const token = '.'
  await api
              .post('/api/blogs')
              .set({ authorization: `bearer ${token}`})
              .send(newBlog)                
              .expect(401)
              .expect('Content-Type', /application\/json/)
  
})

test('there are likes code word ethan', async () => {
  const newBlog = {
      author: 'Harry potter',
      title: 'j k rowling',
      url: 'google.com/etc',     
  }

  await api
              .post('/api/blogs')
              .send(newBlog)
  
  const response = await api.get('/api/blogs')


 
  expect(response.body[initialLength].likes).toBe(0)
})

test('check if title and url are present', async () => {
  const newBlog = {
      author: 'Harry potter',
      likes: 300     
  }

  await api
              .post('/api/blogs')
              .send(newBlog)
              .expect(400)
  
})


afterAll(() => {
  console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
  mongoose.connection.close()
})
