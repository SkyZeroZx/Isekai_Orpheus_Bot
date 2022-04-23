import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as cors from "cors";
import * as helmet from "helmet";
const PORT = process.env.PORT || 3000;
import routes from './routes';
createConnection().then(async connection => {

    // create express app
    const app = express();
    //Middlewares
    app.use(cors());
    app.use(helmet());
    app.use(express.json({limit: '50mb'}));
    app.use(express.static('upload'));

    //Routes
    app.use('/',routes);
    // start express server
    app.listen(PORT,()=> console.log(`server listening ${PORT}`));

  
}).catch(error => console.log(error));
