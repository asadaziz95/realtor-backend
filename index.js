// const { ApolloServer, gql } = require('apollo-server');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const mongoose = require('mongoose');
// const connectDB = require('./config/db');
// const User = require('./models/User');
// const Customer = require('./models/Customer');

// // Connect to MongoDB
// connectDB();

// // Define your GraphQL schema


// const typeDefs = gql`
//   type User {
//     id: ID!
//     name: String!
//     email: String!
//     age: Int!
//     password: String!
//   }

//   type Customer {
//     customerId: String!
//     customerName: String!
//     customerContactNumber: String!
//     dateOfSale: String!
//     totalDownPayment: Float!
//     totalPayment: Float!
//     commission: Float!
//     dealerName: String!
//     createdBy: User!
//   }

//   type Query {
//     users: [User]
//     user(id: ID!): User
//     customers: [Customer]
//     customer(customerId: String!): Customer
//   }
//   type AuthPayload {
//     token: String!
//   }

//   type Mutation {
//     createUser(name: String!, email: String!, age: Int!, password: String!): User
//     login(email: String!, password: String!): AuthPayload
//     createCustomer(
//       customerName: String!
//       customerContactNumber: String!
//       totalDownPayment: Float!
//       totalPayment: Float!
//       commission: Float!
//       dealerName: String!
//     ): Customer
//     updateUser(
//       id: ID!
//       name: String
//       email: String
//       age: Int
//       password: String
//     ): User
//   }
// `;

// // Define your resolvers
// const resolvers = {
//   Query: {
//     users: async () => await User.find(),
//     user: async (_, { id }) => await User.findById(id),
//     customers: async () => await Customer.find().populate('createdBy'),
//     customer: async (_, { customerId }) => await Customer.findOne({ customerId }).populate('createdBy'),
//   },
//   Mutation: {
//     createUser: async (_, { name, email, age, password }) => {
//       const user = new User({ name, email, age, password });
//       await user.save();
//       return user;
//     },
//     login: async (_, { email, password }) => {
//       const user = await User.findOne({ email });
//       if (!user) {
//         throw new Error('User not found');
//       }
//       const isValid = await user.comparePassword(password);
//       if (!isValid) {
//         throw new Error('Invalid password');
//       }
//       const token = jwt.sign({ userId: user._id.toString() }, 'your-secret-key', { expiresIn: '1h' });
//       return { token }; // Return an object with a `token` field
//     },
//     createCustomer: async (_, args, context) => {
//       // Check if the user is authenticated
//       if (!context.userId) {
//         throw new Error('Unauthorized');
//       }
//       // Create the customer
//       const customer = new Customer({
//         ...args,
//         createdBy: context.userId, // Ensure this is a valid ObjectId
//       });
//       await customer.save();
//       // Populate the createdBy field before returning
//       return Customer.findById(customer._id).populate('createdBy');
//     },
//     updateUser: async (_, { id, ...rest }) => {
//       try {
//         // Hash the password if it's being updated
//         if (rest.password) {
//           const salt = await bcrypt.genSalt(10);
//           rest.password = await bcrypt.hash(rest.password, salt);
//         }
  
//         // Find and update the user
//         const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true });
  
//         // If the user is not found, throw an error
//         if (!updatedUser) {
//           throw new Error('User not found');
//         }
  
//         // Return the updated user
//         return updatedUser;
//       } catch (err) {
//         console.error('Error updating user:', err);
//         throw new Error('Failed to update user');
//       }
//     },
//   },
 
// };
// // Create an Apollo Server instance
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => {
//     // Get the token from the request headers
//     const token = req.headers.authorization || '';
//     if (token) {
//       try {
//         // Verify the token and extract the user ID
//         const decoded = jwt.verify(token.replace('Bearer ', ''), 'your-secret-key');
//         // Convert userId to ObjectId using the `new` keyword
//         return { userId: new mongoose.Types.ObjectId(decoded.userId) };
//       } catch (err) {
//         console.error('Token verification failed:', err);
//         throw new Error('Invalid token');
//       }
//     }
//     // If no token is provided, return an empty context
//     return {};
//   },
// });

// // Start the server
// server.listen().then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });


