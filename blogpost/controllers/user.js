const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.post("/", async (request, response, next) => {
  const body = request.body
  console.log('sssssssssssssssssssssssssssssssssssssssssssssssssssss',body)

  if (body.password.length < 3) response.status(400).end()
  else {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    try {
      const savedUser =  await user.save()
      response.json(savedUser)
    } catch (error) {
      next(error)
    }
  }
})

usersRouter.get("/", async (request, response) => {
  const users = await User.find({})
                        .populate('blogs')
  response.json(users)
})

module.exports = usersRouter
