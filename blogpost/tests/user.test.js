const bcrypt = require("bcrypt")
const supertest = require("supertest")
const mongoose = require("mongoose")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")


const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())  
 }

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", name: "enthony", passwordHash })

    await user.save()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

test('validators',  async () => {
    const newBlog = {
        username: '3',
        name: '31',
        password: 'google.com/etc',     
    }
  
    await api
                .post('/api/users')
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)
    
})

afterAll(() => {
    mongoose.connection.close()
  })
  