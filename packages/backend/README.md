# Ignite Backend

Apollo Server application providing the backend services for Prometheus
desktop and mobile application.

## Setting up up your environment

Create a `.env` file with the following variables:

```
MONGO_INITDB_ROOT_USERNAME=<username>
MONGO_INITDB_ROOT_PASSWORD=<password without symbols>
MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<db>?authSource=admin
IGNITE_SECRET=<secret ≥ 32 characters>
```

These two environment variables are automatically picked up and used to secure
the mongo database.

## Running server in development

To run the server, first start the database by running `yarn db`.
In a separate terminal, start the server in development using `yarn dev`.
