# Ignite Backend

Apollo Server application providing the primary backend services for Prometheus
desktop and mobile applications. Video transcoding and PDF watermarking for
fund documents are handled by separate services that can be reviewed in
`packages/services`.

## Setting up up your environment

Create a `.env` file with the following variables:

```
# Used for sending emails with apps links (e.g., forgot password)
PROMETHEUS_URL=<url to desktop prometheus app>

# Credentials used as root for local mongo instance started through Docker
MONGO_INITDB_ROOT_USERNAME=<username for local Docker db>
MONGO_INITDB_ROOT_PASSWORD=<password without symbols for local Docker db>

# Connection uri to mongo instance (host = localhost for Docker instance)
MONGO_URI=mongodb://<username>:<password>@<host>:<port>/<db>?authSource=admin

# Random secret used to sign JWTs sent by the backend server
IGNITE_SECRET=<secret ≥ 32 random characters>

# AWS credentials and settings used for uploading to and moving media in the
# S3 bucket
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=A<aws key>
AWS_SECRET_ACCESS_KEY=<aws secret>
MRAP_ENDPOINT=<mrap alias in the form of abcdefg123456.mrap>
AWS_S3_BUCKET=<name of S3 bucket>

# Credentials for getstream
GETSTREAM_ACCESS_KEY=<getstream api key>
GETSTREAM_SECRET=<getstream app secret>

# Random secret used to sign requests sent to the watermarking service
WATERMARK_JWT_SECRET=<secret ≥ 32 random characters>

# Random pair of secrets used to authenticate requests coming from the video
# transcoding service. JWTs signed by either of these two secrets will pass
# authentication. Two options are used here so that the values can be rotated
# without any application downtime.
TRANSCODER_JWT_SECRET_A=<secret ≥ 32 random characters>
TRANSCODER_JWT_SECRET_B=<secret ≥ 32 random characters>

# Location of firebase credentials for push notifications
GOOGLE_APPLICATION_CREDENTIALS=../.firebase/firebase-service-account.json

# Flag indicating whether emails should be sent by specific trigger events
EMAIL_ENABLED=true

# Email address of sender for general emails sent by the backend
EMAIL_SENDER=<sender email address>

# Email address where accreditation emails should be sent
CS_EMAIL=darash.desai+procs@gmail.com

# Email address where compliance-related emails should be sent
COMPLIANCE_EMAIL=darash.desai+pro-compliance@gmail.com
```

Request the appropriate env values for dev and staging from the project lead.
Additionally, make sure to request a `firebase-service-account.json` file.
This should be placed inside a `packages/backend/.firebase/` directory and is
required for push notifications to be active.

## Running server in development

### Remote development database

Set the appropriate mongo URI to connect to the remote mongo development
database, and then run `yarn dev` to start a local development server. **Note:**
Due to the use of a remote database, latency of requests may be
significantly longer. This is normal.

### Local development database

If running a local mongo database, start the local instance by running
`yarn db`. Make sure the database is seeded with appropriate seed data.
**Note:** Running a local mongo database will cause posts with videos to fail.
