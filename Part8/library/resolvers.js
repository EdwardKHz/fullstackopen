const Author = require('./models/Author')
const Book = require('./models/Book')
const { GraphQLError } = require('graphql/error')
const User = require('./models/User')
const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    authorCount: async () => await Author.countDocuments(),
    bookCount: async () => await Book.countDocuments(),
    allBooks: async (root, args) => {
      const { author, genre } = args
      const filter = {}

      if (author) {
        const authorDoc = await Author.findOne({ name: author })
        if (!authorDoc) return []
        filter.author = authorDoc._id
      }

      if (genre) filter.genres = genre

      return Book.find(filter).populate('author')
    },
    allAuthors: async () => await Author.find(),
    me: async (root, args, context) =>  context.currentUser
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (args.title.length < 5) {
        throw new Error('Title must be at least 5 characters long')
      }

      if (!currentUser) {
        console.log('not authenticated')
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        console.log('no author')
        author = await new Author({ name: args.author }).save()
      }

      const book = new Book({ ...args, author: author._id })
      const saved = await book.save()

      const populated = await saved.populate('author')
      return populated
    },
    editAuthor: async (root, args, context) => {
      const { name, setBornTo } = args
      const currentUser = context.currentUser

      try {
        if (!currentUser) {
          console.log('not authenticated')
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }

        const author = await Author.findOne({ name })
        if (!author) {
          console.log('no atuhor')
          return null
        }

        author.born = setBornTo
        console.log('saving author', author)
        return await author.save()
      } catch (error) {
        console.log(error)
        throw new Error(error.message)
      }
    },
    createUser: async (root, args) => {
      const {username, favoriteGenre} = args
      try {
        const user = new User({username, favoriteGenre})
        return await user.save()
      } catch (error) {
        throw new Error(error.message)
      }
    },
    login: async (root, args) => {
      const {username, password} = args
      const user = await User.findOne({username})

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },

  Author: {
    bookCount: async (root) => Book.countDocuments({author : root._id})
  },
}

module.exports = resolvers