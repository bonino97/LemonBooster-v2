
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

io.origins('*:*');

require('./Config/TelegramBot');
require('./Config/Db');
require('dotenv').config({path: '.env'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// app.use(cors({
//     origin: ['http://localhost:5001', 'http://127.0.0.1:5001', 'http://lemonsec.com', 'http://booster.lemonsec.com', 'https://lemonsec.com', 'https://booster.lemonsec.com, http://beta.lemonbooster.com, https://beta.lemonbooster.com, http://lemonbooster.com, https://lemonbooster.com'],
//     credentials: true
// })); // Initializing CORS, dont remember import.

app.use(cors());

/* ROUTES */
const IndexRoutes = require('./Routes/IndexRoutes');
const ProgramRoutes = require('./Routes/ProgramRoutes');
const SeedsRoutes = require('./Routes/SeedsRoutes');
const EnumerationRoutes = require('./Routes/EnumerationRoutes');
const DiscoveryRoutes = require('./Routes/DiscoveryRoutes');
const ResultsRoutes = require('./Routes/ResultsRoutes');
const MonitoringRoutes = require('./Routes/MonitoringRoutes');

app.use('/api', IndexRoutes());
app.use('/api/programs', ProgramRoutes);
app.use('/api/seeds', SeedsRoutes);
app.use('/api/enumeration', EnumerationRoutes);
app.use('/api/discovery', DiscoveryRoutes);
app.use('/api/results', ResultsRoutes);
app.use('/api/monitoring', MonitoringRoutes);

//Http Server Start
httpServer.listen((process.env.PORT || 5000), () => {
    console.log(`Backend: lemon-booster ~ Online - Running on PORT: ${ process.env.PORT || 5000 }`)
});

app.use('/Static', express.static(path.join(__dirname, process.env.RESULTS_DIR)));

app.set('socketio', io);
//Socket Start
socket.Connection(io); // Socket Methods inside Connect.


