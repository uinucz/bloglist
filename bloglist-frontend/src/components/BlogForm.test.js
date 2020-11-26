import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('form', () => {
    const createBlog = jest.fn()
    const setSuccessMessage = jest.fn()
    const component = render(
        <BlogForm
            createBlog={createBlog}
            setSuccessMessage={setSuccessMessage}
        />
    )
    component.debug()

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const likes = component.container.querySelector('#likes')

    const form = component.container.querySelector('form')

    fireEvent.change(title, {
        target: { value: 'testing of forms could be easier' },
    })
    fireEvent.change(author, { target: { value: 'joni' } })
    fireEvent.change(url, { target: { value: 'fullstackopen' } })
    fireEvent.change(likes, { target: { value: 1000 } })

    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(
        'testing of forms could be easier'
    )
    expect(createBlog.mock.calls[0][0].author).toBe('joni')
    expect(createBlog.mock.calls[0][0].url).toBe('fullstackopen')
    // expect(createBlog.mock.calls[0][0].likes).toBe(1000)
})
