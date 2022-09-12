import { ApolloServerPlugin } from "apollo-server-plugin-base";

const apolloLoggingPlugin: ApolloServerPlugin = {
  async requestDidStart() {
    let operation: string | null;
    const start = process.hrtime();

    return {
      // Apollo server lifetime methods that you can use. https://www.apollographql.com/docs/apollo-server/integrations/plugins/#responding-to-request-lifecycle-events
      async didResolveOperation(context) {
        operation = context.operationName;
      },
      async willSendResponse(context) {
        const elapsed = process.hrtime(start)[1];
        const size = JSON.stringify(context.response).length * 2;
        console.log(
          `ApolloServer log: operation=${operation} duration=${elapsed.toLocaleString()}ns bytes=${size}`
        );
      },
      async didEncounterErrors({ operationName, request, errors }) {
        const error = {
          operationName,
          request,
          errors,
        };
        console.log("Did encounter error: ", JSON.stringify(error));
      },
    };
  },
  async serverWillStart() {
    console.log("Server starting up!");
  },
};

export default apolloLoggingPlugin;
