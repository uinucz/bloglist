describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      username: 'name',
      password: 'pass',
      name: 'caleb',
    }
    cy.request('POST', 'http://localhost:3001/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('password')
    cy.contains('username')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click()
      cy.get('input:first').type('name')
      cy.get('input:last').type('pass')
      cy.get('#login-button').click()
      cy.contains('login confirmed')
    })

    it('fails with wrong credentials', function () {
      cy.contains('login').click()
      cy.get('#username').type('afasfsfa')
      cy.get('#password').type('adfafadsf')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Wrong credentials')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'name', password: 'pass' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog can be created')
      cy.get('#author').type('joniboy')
      cy.get('#url').type('google.com/about')
      cy.get('#likes').type(2332)
      cy.contains('save').click()
      cy.contains('a blog can be created')
    })

    it('user can like a blog', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog can be created')
      cy.get('#author').type('joniboy')
      cy.get('#url').type('google.com/about')
      cy.get('#likes').type(2332)
      cy.contains('save').click()

      cy.contains('view').click()
      cy.contains('google.com/about').contains('like').click()
      cy.contains('google.com/about').contains(2333).click()
    })

    it('user can delete his blog', function () {
      cy.contains('new blog').click()
      cy.get('#title').type('a blog can be created')
      cy.get('#author').type('joniboy')
      cy.get('#url').type('google.com/about')
      cy.get('#likes').type(2332)
      cy.contains('save').click()

      cy.contains('view').click()
      cy.contains('google.com/about').contains('delete').click()
      cy.contains('deleted')
    })

    it(`other users can't delete author's blog`, function () {
      //create a blog
      cy.contains('new blog').click()
      cy.get('#title').type('a blog can be created')
      cy.get('#author').type('joniboy')
      cy.get('#url').type('google.com/about')
      cy.get('#likes').type(2332)
      cy.contains('save').click()
      //log out
      cy.contains('logout').click()
      //create second user
      const user = {
        username: 'name2',
        password: 'pass2',
        name: 'brad',
      }
      cy.request('POST', 'http://localhost:3001/api/users', user)
      cy.visit('http://localhost:3000')
      //log in
      cy.contains('login').click()
      cy.get('input:first').type('name2')
      cy.get('input:last').type('pass2')
      cy.get('#login-button').click()
      //attempt to delete the blog
      cy.contains('a blog can be created').contains('view').click()

      cy.contains('a blog can be created').should('not.contain', 'delete')
    })

    it.only(`blogs are sorted by likes`, function () {
      //create blogs
      cy.createBlog({
        title: ' a blog can be created',
        author: 'joniboy',
        url: 'google.com/about1',
        likes: 22,
      })
      cy.createBlog({
        title: ' second blog',
        author: 'tolstoy',
        url: 'google.com/about/2',
        likes: 10,
      })
      cy.createBlog({
        title: ' google.com/about/2',
        author: 'orwell',
        url: 'google.com/about3',
        likes: 32,
      })

      //create a blog 3
      //   cy.wait(1000)
      //   cy.contains('new blog').click()
      //   cy.get('#title').type('c')
      //   cy.get('#author').type('orwell')
      //   cy.get('#url').type('google.com/about/3')
      //   cy.get('#likes').type(32)
      //   cy.contains('save').click()
      //   cy.contains('view').click()
      //get all the blogs
      // cy.wait(1000)

      cy.contains('view').click()
      cy.contains('view').click()
      cy.contains('view').click()

      cy.get('.likes').then((x) => {
        const amountOfLikes = x.toArray().map((y) => parseInt(y.innerText))
        const amountOfLikes2 = [...amountOfLikes].sort(function (a, b) {
          if (a > b) {
            return 1
          }
          if (a < b) {
            return -1
          }
          return 0
        })
        let result = true
        for (let i = 0; i < amountOfLikes.length && result; i++) {
          if (amountOfLikes[i] !== amountOfLikes2[i]) result = false
        }
        expect(result).to.equal(true)
      })
    })
  })
})
