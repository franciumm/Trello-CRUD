import Joi from 'joi';
export const signUp = Joi.object({
    userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
    email:Joi.string().email({ minDomainSegments: 2,maxDomainSegments:3, tlds: { allow: ['com', 'net','eg','edu'] } }).required(),
    password:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/)).required(),
    cPassword: Joi.string().valid(Joi.ref('password')).required(),
    phone: Joi.string().max(13).min(10),
    gender: Joi.string(),
    age : Joi.number().integer().positive().min(10).max(100)


}).required();






export const logIn = Joi.object({
    email : Joi.string().email({ minDomainSegments: 2,maxDomainSegments:3, tlds: { allow: ['com', 'net','eg','edu'] } }).required(),
    password: Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/)).required(),
    userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)


}).required();


export const UserUpdate = Joi.object({
    userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
    phone: Joi.string().max(13).min(10),
    age : Joi.number().integer().positive().min(10).max(100)


}).required();


export const changePass = Joi.object({
    oldPassword:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/)).required(),
    newPassword:Joi.string().pattern(new RegExp(/^[a-zA-Z0-9]{3,30}$/)).required(),
    cPassword: Joi.string().valid(Joi.ref('password')).required(),


}).required();
