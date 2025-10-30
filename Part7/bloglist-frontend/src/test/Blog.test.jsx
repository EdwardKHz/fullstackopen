import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog.jsx'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

describe('Blog', () => {

    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'test',
        likes: 0,
        user: {
            name: 'Test User',
            username: 'testuser'
        }
    }

    test('renders without url and likes', () => {
        render(<Blog blog={blog} />)

        const titleAndAuthor = screen.getByText('Component testing is done with react-testing-library Test Author',)
        expect(titleAndAuthor).toBeDefined()

        const url = screen.queryByText('test')
        const likes = screen.queryByText('likes 0')

        expect(url).toBeNull()
        expect(likes).toBeNull()
    })

    test('renders url and likes when the button has been clicked', async () => {
        render(<Blog blog={blog} />)

        const titleAndAuthor = screen.getByText('Component testing is done with react-testing-library Test Author',)
        expect(titleAndAuthor).toBeDefined()

        const url = screen.queryByText('test')
        const likes = screen.queryByText('likes 0')

        expect(url).toBeNull()
        expect(likes).toBeNull()

        const user = userEvent.setup()
        const button = screen.getByText('show')
        await user.click(button)

        const urlAfter = screen.findByText('test')
        const likesAfter = screen.findByText('likes 0')

        expect(urlAfter).toBeDefined()
        expect(likesAfter).toBeDefined()
    })

    test('if the like button is clicked twice, the event handler is called twice', async () => {
        const mockHandler = vi.fn()
        const user = userEvent.setup()
        render(<Blog blog={blog} updateLikes={mockHandler} />)

        const button = screen.getByText('show')
        await user.click(button)

        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)

        expect(mockHandler.mock.calls).toHaveLength(2)
    })
})
