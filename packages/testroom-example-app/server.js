const express = require('express');
const app = express();
const port = 3001;

const testItems = [
  { id: '133', type: 0, name: 'This is text for the sake of testing. It matters not what it says.' },
  { id: '13', type: 1, name: 'Testing the website bit by bit. In the event of testing things will go wrong.' },
  { id: '133as', type: 2, name: 'When tests are run things will go wrong. It is now your chance to correct.' },
  { id: '3sf2', type: 0, name: 'This is text for the sake of testing. It matters not what it says.' },
  { id: '1993', type: 0, name: 'Testing the website bit by bit. In the event of testing things will go wrong.' },
  { id: 'fsk34', type: 2, name: 'When tests are run things will go wrong. It is now your chance to correct.' }
];

app.get('/api/v1/testitems', (req, res) => res.send(testItems));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
