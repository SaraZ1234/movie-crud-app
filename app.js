//Core Module
const path = require('path');
const express = require('express');
const rootDir = require('./utils/pathUtil');


const hostRouter = require('./routes/Hostroute');


const app = express();


//ejs
app.set('view engine', 'ejs');
//telling vscode that I will use ejs in views folder. (Means any file of views folder).
app.set('views', 'views');

app.use(express.static(path.join(rootDir, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use('/host',hostRouter);

const port = 3002;

app.listen(port, () => {
  console.log(`Server running on address http://localhost:${port}`);

})

