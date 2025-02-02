import { ApolloServer } from "apollo-server-micro";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import Customer from "../../models/Customer";
import connectDB from "../../config/db";


// Define GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
    password: String!
  }

  type Customer {
    customerId: String!
    customerName: String!
    customerContactNumber: String!
    dateOfSale: String!
    totalDownPayment: Float!
    totalPayment: Float!
    commission: Float!
    dealerName: String!
    createdBy: User!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    customers: [Customer]
    customer(customerId: String!): Customer
  }

  type AuthPayload {
    token: String!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int!, password: String!): User
    login(email: String!, password: String!): AuthPayload
    createCustomer(
      customerName: String!
      customerContactNumber: String!
      totalDownPayment: Float!
      totalPayment: Float!
      commission: Float!
      dealerName: String!
    ): Customer
    updateUser(
      id: ID!
      name: String
      email: String
      age: Int
      password: String
    ): User
  }
`;

// Define Resolvers
const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
    customers: async () => await Customer.find().populate('createdBy'),
    customer: async (_, { customerId }) => await Customer.findOne({ customerId }).populate('createdBy'),
  },
  Mutation: {
    createUser: async (_, { name, email, age, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, age, password: hashedPassword });
      await user.save();
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }
      const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token };
    },
    createCustomer: async (_, args, context) => {
      if (!context.userId) {
        throw new Error('Unauthorized');
      }
      const customer = new Customer({ ...args, createdBy: context.userId });
      await customer.save();
      return Customer.findById(customer._id).populate('createdBy');
    },
    updateUser: async (_, { id, ...rest }) => {
      if (rest.password) {
        rest.password = await bcrypt.hash(rest.password, 10);
      }
      const updatedUser = await User.findByIdAndUpdate(id, rest, { new: true });
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    if (token) {
      try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        return { userId: new mongoose.Types.ObjectId(decoded.userId) };
      } catch (err) {
        console.error("Token verification failed:", err);
      }
    }
    return {};
  },
});

const startServer = server.start();

export default async function handler(req, res) {
  await startServer;
  await server.createHandler({ path: "/api/graphql" })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};