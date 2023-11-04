import { Router } from "express";
import * as TaskStartController from './controller/Task.start.js' ;
import *  as TaskSearchController from './controller/Task.Search.js' 
import * as TaskEditController from './controller/Task.Edit.js'
import * as Verfiy from "../../utils/Verfiy.js";
import { TodayFun } from "../../utils/Date.js";
const router = Router();

router.post('/addTask',Verfiy.verifytoken,TodayFun, TaskStartController.addTask);
router.get('/getAllTasks',Verfiy.verifytoken,TaskSearchController.getAllTasks);
router.get('/getAllCreatedTasks',Verfiy.verifytoken,TaskSearchController.GetCreatedTasks);
router.get('/getAllAssignTasks',Verfiy.verifytoken,TaskSearchController.GetAssignedTasks);
router.get('/allLateTasks',Verfiy.verifytoken,TodayFun,TaskSearchController.GetLateTasks);
router.get('/getTasksAssignToAnyUser/:id',Verfiy.verifytoken,TaskSearchController.getTasksAssignToAnyUser)
router.put('/updateTask/:Taskid',Verfiy.verifytoken,TodayFun,TaskEditController.TaskUpdate);
router.delete('/deleteTask/:taskid',Verfiy.verifytoken,TaskEditController.DelTask)
export default router ;