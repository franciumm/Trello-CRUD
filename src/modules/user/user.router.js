import Router from 'express'
import * as UserStartController from './controller/userStart.js'
import * as UserEditController from './controller/userEdit.js'
import * as verifyin from '../../utils/Verfiy.js';
import * as UserMailConfirm from './controller/Email.Confirm.js'
import {validation} from '../../middlewares/validation.js'
import * as Validates from './validation.js'

const router = Router()



router.post('/signup',validation(Validates.signUp),UserStartController.UserSignUp);
router.post('/logIn',validation(Validates.logIn),UserStartController.UserSignIn);
router.put('/update',validation(Validates.UserUpdate),verifyin.verifytoken,UserEditController.UserUpdate);
router.patch('/changePassword',validation(Validates.changePass),verifyin.verifytoken,UserEditController.passchange);
router.delete('/delete',UserEditController.UserDelete);
router.patch('/logout' , UserEditController.UserLogout);
router.patch('/softDelete' , UserEditController.sofDelete);
router.get('/confirmEmail/:mail', UserMailConfirm.confirmEmail);
router.get('/newConfirmEmail/:mail',UserMailConfirm.newConfirmEmail)
export default router ;