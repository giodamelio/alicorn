import express from 'express';

import api from './api';

const app = express();

// Mount the api
app.use('/api', api);

const PORT = 3141;
app.listen(PORT);
console.log(`App listening at http://localhost:${PORT}`);
