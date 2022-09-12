This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before getting started, created a `.env.local` file in the desktop application
directory and add the following variables:

```
NEXTAUTH_URL={base url for desktop application, e.g., https://localhost:3000}
NEXTAUTH_SECRET={secret ≥ 32 characters}
ADMIN_SECRET={secret ≥ 32 characters}
```

Next, create a `.env.development.local` file in the desktop application
directory and add the following variables:

```
NEXT_PUBLIC_GRAPHQL_URI={url to the backend graphql server}
NEXT_PUBLIC_AWS_BUCKET=https://media2-dev.prometheusalts.com
APP_ENV={development | staging | production }
MONGO_URI=mongodb+srv://<username>:<password>@pro-dev.hd1k6.mongodb.net/prometheusalts?retryWrites=true&w=majority
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
MRAP_ENDPOINT={mrap endpoint for aws bucket}
AWS_S3_BUCKET={aws bucket name}
```

Run the development server:

```bash
yarn dev
```

Navigate to http://localhost:3001 to visit the ap. Note that pages will
automatically hot reload when changes are made and saved.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
