import  UserRouter from './modules/user/user.router.js';
import TaskRouter from './modules/Task/task.router.js'
import {globalerrorHandling} from './utils/errorHandling.js'
import DBconnect from '../DB/connection.js';


const bootstrap= (app,express)=>{
DBconnect();
app.use(express.json());
app.use('/user', UserRouter);
app.use('/task',TaskRouter)
app.use('*',(req,res,next)=>{
res.json ('In-Valid Routing')
})
app.use(globalerrorHandling);

};


export default  bootstrap