const data = require('./data');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(cookieParser())
app.use('/static', express.static('static'))
app.use('/public', express.static('public'));

let currentPath = 'harris';
//sets the current story path 
let currentStep = 0;
//sets the current step in the data 

const results = {};
//stores all of the peoples names with their votes 

const allPlayers = new Set();
//stores the players so they can be displayed 

let isStarted = false;

app.set('view engine', 'ejs');

app.get('/present', (req, res) => {
  const currentData = data[currentPath].steps[currentStep];
  if (!results[currentPath]) {
    results[currentPath] = {};
  }

  if (!isStarted) {
    res.render('wait-for-players', { allPlayers });
    //renders the page saying that you're waiting for players to join, and passes in all the players to be displayed
    return;
  }

  res.render(currentData.presentTemplate, { ...currentData, results: results[currentPath] });
  //renders whatever currentData and currentPath are set to
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
  //mobileTemplate is what's written in data.js
  //when we render mobile template, going to take the template file, pass in the second paramater, which is the object created
  //inside the template file, we can use everything we passed in, so the ... means we're taking the current 
  //data object, making a new object that has all the keys and values from currentData, but also sticking in currentStep
});

io.on('connection', socket => {
  //when the socket is connected
  const cookies = cookie.parse(socket.handshake.headers.cookie);
  if (!isStarted && !allPlayers.has(cookies.name)) {
    allPlayers.add(cookies.name);
    //takes the name stored in the cookie and adds it to all players
    //client has to pass this to the server because cookies can't be stored on the server
    io.emit('reload');
    //reloads everyone every time 
  }

  socket.on('start', () => {
    isStarted = true;
    //when you click the "start" button it sets "isStarted" to be true
    io.emit('reload');
  });

  socket.on('next', () => {
    currentStep++;
    //when you hit the "next" button, it increases the currentStep counter, which moves it next
    io.emit('reload');
  });

  socket.on('back', () => {
    currentStep--;
    //when you hit the "back" button, it decreases the currentStep counter, which moves it back 
    results[currentPath] = {};
    io.emit('reload');
  });

  socket.on('adjudicate', () => {
    const allChoices = unique(Object.values(results[currentPath]));
    //taking all of the choices that were submitted
    const randomIndex = Math.floor(Math.random() * allChoices.length);
    //picking a random number based on the number of choices inputted
    const randomChoice = allChoices[randomIndex];
    //getting the choice that exists at that index

    currentPath = data[currentPath].destinations[randomChoice];
    //sets the currentPath to be the choice that was pulled out of the array
    currentStep = 0;
    //sets the step of that path to be 0 
    io.emit('reload');
    //reloads everyone's devices
  });

  socket.on('choice', i => {
    const currentResults = results[currentPath]
    currentResults[cookies.name] = i;

    const players = Object.keys(currentResults);
    if (players.length === allPlayers.size) {
      const firstChoice = currentResults[players[0]];
      //compares the choices of the first player 
      for (let i = 1; i < players.length; i++) {
        //loops through all the players and compares the choices to the first player 
        if (currentResults[players[i]] !== firstChoice) {
          currentStep++;
          //if any of the players don't match, bring them to the next step (unanimous screen)
          io.emit('reload');
          return;
        }
      }

      currentPath = data[currentPath].destinations[firstChoice];
      //if they all match, then go to the destination of the choice (path)
      currentStep = 0;
      //start that path at step 0
      io.emit('reload');
      //reload everyone's devices to match 
    }
  })
});

server.listen(80);

function unique(array) {
  return [...new Set(array)];
  //gets rid of duplicates in the array 
}
