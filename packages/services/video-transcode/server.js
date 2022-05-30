const express = require('express');
const app = express();
const routes = require('./api-routes/routes');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

routes(app);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});