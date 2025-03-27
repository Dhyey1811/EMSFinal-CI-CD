const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config()
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers/resolvers');
const cors = require('cors');


// Feedback: Dotenv package is not used for storing sensitive info
// Added now

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  try {
    mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log('Connected to db');
    }).catch(err => {
      console.error(err);
    });
  } catch (error) {
    console.log(error)
  }
  
  app.listen(process.env.PORT || 8000, () => {
    console.log('Server running on 8000');
  });
}

startServer();
