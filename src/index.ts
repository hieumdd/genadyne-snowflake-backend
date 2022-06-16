import functions from 'firebase-functions';
import express from 'express';

import snowflakeController from './snowflake/snowflake.controller';

const app = express();
app.use(snowflakeController);

exports.main = functions.https.onRequest(app);
