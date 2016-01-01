import express from 'express';

const app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

const PORT = 3141;
app.listen(PORT);
console.log(`App listening at http://localhost:${PORT}`);
