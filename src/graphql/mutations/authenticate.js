import { gql, UserInputError } from 'apollo-server';
import * as yup from 'yup';
import bcrypt from 'bcrypt';

import User from '../../models/User.js';

export const typeDefs = gql`
  input AuthenticateInput {
    username: String!
    password: String!
  }

  type AuthenticatePayload {
    user: User!
    accessToken: String!
    expiresAt: DateTime!
  }

  extend type Mutation {
    """
    Generates a new access token, if provided credentials (username and password) match any registered user.
    """
    authenticate(credentials: AuthenticateInput): AuthenticatePayload
  }
`;

const argsSchema = yup.object().shape({
  credentials: yup.object().shape({
    username: yup.string().required().lowercase().trim(),
    password: yup.string().required().trim(),
  }),
});

export const resolvers = {
  Mutation: {
    authenticate: async (obj, args, { authService }) => {
      const {
        credentials: { username, password },
      } = await argsSchema.validate(args, {
        stripUnknown: true,
      });

      const user = await User.query().findOne({ username });

      if (!user) {
        throw new UserInputError('Invalid username or password');
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new UserInputError('Invalid username or password');
      }

      return {
        user,
        ...authService.createAccessToken(user.id),
      };
    },
  },
};

export default {
  typeDefs,
  resolvers,
};
