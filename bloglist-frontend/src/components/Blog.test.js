import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import { prettyDOM } from '@testing-library/dom'

describe('blog tests', () => {
  let component, blog

  beforeEach(() => {
    blog = {
      title: 'adfasfaf',
      author: 'dfadfadf',
      url: 'adfdasfdasf',
      likes: 324234,
    }
    component = render(<Blog blog={blog} />)
  })

  test('renders title and author not url or likes', () => {
    expect(component.container).toHaveTextContent(`${blog.title}`)
    expect(component.container).toHaveTextContent(`${blog.author}`)
    expect(component.container).not.toHaveTextContent(`${blog.url}`)
    expect(component.container).not.toHaveTextContent(`${blog.likes}`)
  })

  test('clicking reveals details', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const element = component.container.querySelector('.revealed')
    expect(element).toBeDefined()
  })
})

test('two likes', () => {
  const blog = {
    title: 'newtitle',
    author: 'newauthor',
    url: 'newurl',
    likes: 111111,
  }

  const mockHandler = jest.fn()
  const component = render(<Blog blog={blog} addLike={mockHandler} />)

  const button = component.getByText('view')
  fireEvent.click(button)

  const button2 = component.getByText('like')
  fireEvent.click(button2)
  fireEvent.click(button2)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
