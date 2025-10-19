import {test, expect} from '@playwright/test'
import log from "eslint-plugin-react/lib/util/log.js";

const logIn = async (page, username, password) => {
    const usernameInput = page.getByPlaceholder('username')
    const passwordInput = page.getByPlaceholder('password')

    await usernameInput.fill(username)
    await passwordInput.fill(password)

    const loginButton = page.getByRole('button', {name: 'log in'})
    await loginButton.click()
}

const createBlog = async (page, title, author, url) => {
    const createButton = page.getByRole('button', {name: 'create new blog'})
    await createButton.click()

    const titleInput = page.getByLabel('title:')
    const authorInput = page.getByLabel('author:')
    const urlInput = page.getByLabel('url:')

    await titleInput.fill(title)
    await authorInput.fill(author)
    await urlInput.fill(url)

    const submitButton = page.getByRole('button', {name: 'create'})
    await submitButton.click()
}

test.describe('Blog app', () => {
    test.beforeEach(async ({page, request}) => {
        try {
            await request.post('http://localhost:3003/api/testing/reset')

            await request.post('http://localhost:3003/api/users', {
                headers: { 'Content-Type': 'application/json' },
                data: {
                    name: 'user',
                    username: 'testUser1',
                    password: '12345678'
                }
            })
            await request.post('http://localhost:3003/api/users', {
                headers: { 'Content-Type': 'application/json' },
                data: {
                    name: 'user',
                    username: 'testUser2',
                    password: '12345678'
                }
            })
        } catch (err) {
            console.error('Backend not reachable:', err.message)
        }
        await page.goto('http://localhost:5173')
    })

    test('Login form is shown', async ({page}) => {
        await page.pause()
        const locator = page.getByText('log in to application')
        await expect(locator).toBeVisible()
    })

    test.describe('Login', () => {
        test('succeeds with correct credentials', async ({page}) => {

           await logIn(page, 'testUser', '12345678')

            const loggedInUser = page.getByText('user logged in')
            await expect(loggedInUser).toBeVisible()
        })

        test('fails with wrong credentials', async ({page}) => {

            await logIn(page, 'testUser', 'wrongPassword')

            const loginButton = page.getByRole('button', {name: 'log in'})
            await loginButton.click()

            const error = page.getByText('Wrong credentials')
            await expect(error).toBeVisible()
        })
    })

    test.describe('When logged in', () => {
        test.beforeEach(async ({page}) => {
            await logIn(page, 'testUser1', '12345678')
        })

        test('a new blog can be created', async ({page}) => {
            await createBlog(page, 'title', 'author', 'url')

            const newBlog = page.getByText('title author')
            await expect(newBlog).toBeVisible({timeout: 10000})

        })

        test('users can like a blog', async ({page}) => {
            await createBlog(page, 'title', 'author', 'url')

            const showButton = page.getByRole('button', {name: 'show'})
            await showButton.click()

            const likeButton = page.getByRole('button', {name: 'like'})
            await likeButton.click()

            const likes = page.getByText('likes 1')
            await expect(likes).toBeVisible()
        })

        test('users can delete their own blog', async ({page}) => {
            await createBlog(page, 'title', 'author', 'url')

            const showButton = page.getByRole('button', {name: 'show'})
            await showButton.click()

            page.once('dialog', dialog => {
                expect(dialog.type()).toBe('confirm')
                dialog.accept()
            })

            const removeButton = page.getByRole('button', {name: 'remove'})
            await removeButton.click()

            const deletedBlog = page.getByText('title author')
            await expect(deletedBlog).not.toBeVisible()
        })

        test('users cannot delete blogs created by other users', async ({page}) => {
            await createBlog(page, 'title', 'author', 'url')

            const showButton = page.getByRole('button', {name: 'show'})
            await showButton.click()

            const removeButton = page.getByRole('button', {name: 'remove'})
            await expect(removeButton).toBeVisible()

            const logOutButton = page.getByRole('button', {name: 'logout'})
            await logOutButton.click()

            await logIn(page, 'testUser2', '12345678')

            await showButton.click()

            await expect(removeButton).not.toBeVisible()
        })
    })
})




