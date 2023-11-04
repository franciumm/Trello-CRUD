import express from 'express'; 
import bootstrap from './src/index.router.js';
import dontenv from 'dotenv';
dontenv.config();
const app = express();
app.listen(3000,()=>{console.log('Server Running ');});


bootstrap(app,express)

