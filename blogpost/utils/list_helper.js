const { forEach } = require("lodash")
const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map((x) => x.likes).reduce((a, b) => a + b)
}

const favouriteBlog = (blogs) => {
  const a = blogs.map((x) => x.likes)
  let max = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] > a[max]) max = i
  }
  return (({ title, author, likes }) => ({ title, author, likes }))(blogs[max])
}

const mostBlogs = (blogs) => {
  const arrayOfNames = blogs.map((x) => x.author)
  const countedNames = _.countBy(arrayOfNames)
  const pairsArray = _.toPairs(countedNames)
  const lastElement = _.last(pairsArray)

  return {
    author: lastElement[0],
    blogs: lastElement[1],
  }
}

const mostLikes = (blogs) => {
  const myArray = blogs.map((x) => x.author)
  const names = _.uniq(myArray)
  const namesWithCounter = names.map((name) => [name, 0])
  const counterObject = _.fromPairs(namesWithCounter)

  blogs.forEach((element) => {
    counterObject[element.author] += element.likes
  })

  const x = _.toPairs(counterObject)

  let iMax = 0
  for (let i = 0; i < x.length; i++) if (x[i][1] > x[iMax][1]) iMax = i

  return {
    author: x[iMax][0],
    likes: x[iMax][1],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}
