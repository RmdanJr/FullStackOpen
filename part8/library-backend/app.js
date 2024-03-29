require('dotenv').config()
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const mongoose = require('mongoose')
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')

const { execute, subscribe } = require('graphql')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const User = require('./models/user')

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log('connected to db'))
  .catch((error) => console.log(error.message))

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({ server: httpServer, path: '/' })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()
  server.applyMiddleware({
    app,
    path: '/',
  })

  httpServer.listen(process.env.PORT, () =>
    console.log(`Server is now running on http://localhost:${process.env.PORT}`)
  )
}

start()
