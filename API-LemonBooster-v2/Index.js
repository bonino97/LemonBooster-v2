
const http = require('http');
const SocketIO = require('socket.io');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const httpServer = http.createServer(app); //Http with express & http with socket.
const io = SocketIO(this.httpServer).listen(httpServer);

const socket = require('./Config/Sockets');


require('./Config/Db');
require('dotenv').config({path: '.env'});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors({
    origin: ['http://localhost:5001', 'http://127.0.0.1:5001'],
    credentials: true
})); // Initializing CORS, dont remember import.

/* ROUTES */
const IndexRoutes = require('./Routes/IndexRoutes');
const ProgramRoutes = require('./Routes/ProgramRoutes');
const AmassRoutes = require('./Routes/AmassRoutes');
const EnumerationRoutes = require('./Routes/EnumerationRoutes');

app.use('/api', IndexRoutes());
app.use('/api/programs', ProgramRoutes);
app.use('/api/amass', AmassRoutes);
app.use('/api/enumeration', EnumerationRoutes);

//Http Server Start
httpServer.listen((process.env.PORT || 5000), () => {
    console.log(`Backend: lemon-booster ~ Online - Running on PORT: ${ process.env.PORT || 5000 }`)
});

app.use('/Static', express.static(path.join(__dirname, '../LemonBooster-Results/')));

app.set('socketio', io);
//Socket Start
socket.Connection(io); // Socket Methods inside Connect.


