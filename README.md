# Role-Based Access Control API

![static-badge](https://img.shields.io/badge/built_with-love-red?style=for-the-badge)
![static-badge](https://img.shields.io/badge/status-success-limegreen?style=for-the-badge)

## 0. Table of Contents

1. [Overview](#1-overview)
2. [API Documentation](#2-api-documentation)
3. [Main Features](#3-main-features)
4. [Schemas and Routes](#4-schemas-and-routes)
   - [Authentication Routes](#authentication-routes)
   - [User Routes](#user-routes)
   - [Role Routes](#role-routes)

## 1. Overview

This project is a collection of REST APIs for a Role-Based Access Control system where certain permissions can be granted to users by assigning them specific roles. Here we don't have to manage permissions for every user. Instead, we have to create roles, map permissions with them, and then assign those roles to users. All the users who have been assigned a specific role inherit all the permissions mapped to it.

This project is built using Express.js and MongoDB; all the APIs are well-documented using Swagger Docs. User authentication has been implemented using JSON Web Tokens and the project is deployed on a DigitalOcean droplet using Nginx as a web server.

## 2. API Documentation

Swagger is used for API documentation. To view API docs, [click here](http://api.rbac.shubhampurwar.in/docs/swagger). All the APIs are live and functional. Select RBAC production server in the dropdown menu and play with any API.

## 3. Main Features

- Authentication enabled using JSON Web Tokens
- Authorization based on roles and permissions
- APIs are deployed on DigitalOcean droplet using Nginx as a web server
- PM2 setup to make sure server keeps running and APIs are always live
- Swagger Docs for documentation of APIs
- Database modelling using various Mongoose schemas
- Logging of HTTP requests using Morgan
- Upload and delete images using Cloudinary APIs
- Ability to send emails using Nodemailer
- Project is based on MVC architecture
- Validation of request payload using Joi library
- Ability to parse multipart/form-data using Formidable
- Centralized error handling using Express middlewares
- Routing using Express middlewares

## 4. Schemas and Routes

This project includes two schemas and over 20 routes and controllers.

### Authentication Routes

| Action          | Method | Route                       | Access Requirements |
| :-------------- | :----- | :-------------------------- | :------------------ |
| Signup          | POST   | /auth/signup                | None                |
| Login           | POST   | /auth/login                 | None                |
| Logout          | POST   | /auth/logout                | Authentication      |
| Forgot password | POST   | /auth/password/forgot       | None                |
| Reset password  | PUT    | /auth/password/reset/:token | None                |

### User Routes

| Action                  | Method | Route                        | Access Requirements            |
| :---------------------- | :----- | :--------------------------- | :----------------------------- |
| Retrieve profile        | GET    | /users/self                  | Authentication                 |
| Update profile          | PUT    | /users/self                  | Authentication                 |
| Delete account          | DELETE | /users/self                  | Authentication                 |
| Add profile photo       | POST   | /users/self/avatar           | Authentication                 |
| Remove profile photo    | PUT    | /users/self/avatar           | Authentication                 |
| Update profile photo    | POST   | /users/self/avatar/update    | Authentication                 |
| Retrieve all users      | GET    | /users                       | Authentication                 |
| Retrieve user by ID     | GET    | /users/:userId               | Authentication + Authorization |
| Update active status    | POST   | /users/:userId/status        | Authentication + Authorization |
| Assign role to user     | PUT    | /users/:userId/role/assign   | Authentication + Authorization |
| Unassign role from user | PUT    | /users/:userId/role/unassign | Authentication + Authorization |
| Archive user            | PUT    | /users/:userId/archive       | Authentication + Authorization |
| Restore archived user   | PUT    | /users/:userId/restore       | Authentication + Authorization |

### Role Routes

| Action              | Method | Route          | Access Requirements            |
| :------------------ | :----- | :------------- | :----------------------------- |
| Retrieve all roles  | GET    | /roles         | Authentication                 |
| Add new role        | POST   | /roles         | Authentication + Authorization |
| Retrieve role by ID | GET    | /roles/:roleId | Authentication + Authorization |
| Update role         | PUT    | /roles/:roleId | Authentication + Authorization |
