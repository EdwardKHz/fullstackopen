import {render, screen} from '@testing-library/react'
import CreateBlog from '../components/CreateBlog.jsx'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

describe('Create blog', async () => {

    test ('calls the event handler it received as props with the right details when a new blog is created', async () => {
        const createBlog = vi.fn()
        const user = userEvent.setup()

        render(<CreateBlog addBlog={createBlog} />)

        const titleInput = screen.getByLabelText('title:')
        const authorInput = screen.getByLabelText('author:')
        const urlInput = screen.getByLabelText('url:')
        const createButton = screen.getByText('create')


        await user.type(titleInput, 'Testing form')
        await user.type(authorInput, 'test name')
        await user.type(urlInput, 'test url')
        await user.click(createButton)

        expect(createBlog.mock.calls).toHaveLength(1)
        expect(createBlog.mock.calls[0][0]).toEqual({
            title: 'Testing form',
            author: 'test name',
            url: 'test url',
        })

    })
})