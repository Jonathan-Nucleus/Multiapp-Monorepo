import { apolloServer } from "backend/lib/server";

apolloServer.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
