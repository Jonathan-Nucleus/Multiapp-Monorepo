import { makeExecutableSchema } from "@graphql-tools/schema";
import type { PartialSchema } from "../apollo/apollo-helper";

import commentsDefinitions from "./comments.graphql";
import companiesDefinitions from "./companies.graphql";
import fundsDefinitions from "./funds.graphql";
import postsDefinitions from "./posts.graphql";
import usersDefinitions from "./users.graphql";
import queryDefinitions from "./queries.graphql";
import mutationDefinitions from "./mutations.graphql";
import datesDefinition from "./dates.graphql";
import notificationsDefinition from "./notifications.graphql";
import helpRequestsDefinition from "./help-requests.graphql";

const definitions = [
  commentsDefinitions,
  companiesDefinitions,
  fundsDefinitions,
  postsDefinitions,
  usersDefinitions,
  queryDefinitions,
  mutationDefinitions,
  datesDefinition,
  notificationsDefinition,
  helpRequestsDefinition,
];

const typeDefs = definitions.map((definition) => definition.schema);
const resolvers = definitions.reduce<Required<PartialSchema["resolvers"]>>(
  (acc, definition) => {
    return {
      ...acc,
      ...definition.resolvers,
    };
  },
  {}
);

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
