import { apolloServer } from "./lib/server";

apolloServer.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
