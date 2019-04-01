const data = require('./data');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(cookieParser())
app.use('/static', express.static('static'))

let currentPath = 'harris';
let currentStep = 0;

const results = {};

const allPlayers = new Set();
let isStarted = false;

app.set('view engine', 'ejs');

app.get('/present', (req, res) => {
  const currentData = data[currentPath][currentStep];
  if (!results[currentPath]) {
    results[currentPath] = {};
  }

  if (!isStarted) {
    res.render('wait-for-players', { allPlayers });
    return;
  }

  res.render(currentData.presentTemplate, { ...currentData, results: results[currentPath] });
});

app.get('/', (req, res) => {
  if (!req.cookies.name) {
    res.render('new-player');
    return;
  }

  if (!isStarted) {
    res.render('mobile-wait-for-players');
    return;
  }
  const currentData = data[currentPath][currentStep];
  res.render(currentData.mobileTemplate, {...currentData, currentStep});
  //when we render mobile template, going to take the template file, pass in the second paramater, which is the object created
  //inside the template file, we can use everything we passed in, so the ... means we're taking the current 
  //data object, making a new object that has all the keys and values from currentData, but also sticking in currentStep
});

io.on('connection', socket => {
  const cookies = cookie.parse(socket.handshake.headers.cookie);
  if (!isStarted && !allPlayers.has(cookies.name)) {
    allPlayers.add(cookies.name);
    io.emit('reload');
  }

  socket.on('start', () => {
    isStarted = true;
    io.emit('reload');
  });

  socket.on('next', () => {
    currentStep++;
    io.emit('reload');
  });

  socket.on('back', () => {
    currentStep--;
    results[currentPath] = {};
    io.emit('reload');
  });

  socket.on('adjudicate', () => {
    const allChoices = unique(Object.values(results[currentPath]));
    const randomIndex = Math.floor(Math.random() * allChoices.length);
    const randomChoice = allChoices[randomIndex];

    currentPath = data[currentPath][currentStep].destinations[randomChoice];
    currentStep = 0;
    io.emit('reload');
  });

  socket.on('choice', i => {
    const currentResults = results[currentPath]
    currentResults[cookies.name] = i;

    const players = Object.keys(currentResults);
    if (players.length === allPlayers.size) {
      const firstChoice = currentResults[players[0]];
      for (let i = 1; i < players.length; i++) {
        if (currentResults[players[i]] !== firstChoice) {
          currentStep++;
          io.emit('reload');
          return;
        }
      }

      currentPath = data[currentPath][currentStep].destinations[firstChoice];
      currentStep = 0;
      io.emit('reload');
    }
  })
});

server.listen(8080);

function unique(array) {
  return [...new Set(array)];
}
