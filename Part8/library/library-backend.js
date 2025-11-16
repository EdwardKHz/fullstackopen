const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const express = require('express')
const http = require('http')
const cors = require('cors')
const dotenv = require('dotenv')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServer } = require('@apollo/server')

const User = require('./models/User')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const { expressMiddleware } = require('@as-integrations/express5')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

dotenv.config();


mongoose.set('strictQuery', false);


const MONGODB_URI = process.env.MONGODB_URI
console.log('Connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

mongoose.set('debug', true)

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
          const currentUser = await User.findById(decodedToken.id)
          return { currentUser }
        }
      },
    }),
  )

  httpServer.listen(4000, () => {
    console.log(`Server is now running on http://localhost:4000`)
  })

}

start()