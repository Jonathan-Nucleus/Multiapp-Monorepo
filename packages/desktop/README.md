This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before getting started, created a `.env.local` file in the desktop application
directory and add the following variables:

```
NEXTAUTH_URL={base url for desktop application, e.g., https://localhost:3000}
NEXTAUTH_SECRET={secret ≥ 32 characters}

DATADOG_RUM_APPLICATION_ID={datadog app id}
DATADOG_RUM_CLIENT_TOKEN={datadog client token}
```

Next, create a `.env.development.local` file in the desktop application
directory and add the following variables:

```
NEXT_PUBLIC_GRAPHQL_URI={url to the backend graphql server}
NEXT_PUBLIC_AWS_BUCKET=https://media-dev.prometheusalts.com
DATADOG_RUM_ENVIRONMENT=development
NEXT_PUBLIC_GETSTREAM_ACCESS_KEY={getstream api key}
```

Run the development server:

```bash
yarn dev
```

Note that pages will automatically hot reload when changes are made and saved.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
