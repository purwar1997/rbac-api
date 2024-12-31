# Role-Based Access Control API

![static-badge](https://img.shields.io/badge/built_with-love-red?style=for-the-badge)
![static-badge](https://img.shields.io/badge/status-success-limegreen?style=for-the-badge)

## 0. Table of Contents

1. [Overview](#1-overview)
2. [Roles and Permissions](#2-roles-and-permissions)
3. [Deployment and Documentation](#3-deployment-and-documentation)
4. [Main Features](#4-main-features)
5. [Schemas and Routes](#5-schemas-and-routes)
   - [Authentication Routes](#authentication-routes)
   - [User Routes](#user-routes)
   - [Role Routes](#role-routes)

## 1. Overview

A RESTful API for a Role-Based Access Control system where permissions to perform certain tasks can be granted to users by assigning them specific roles. Here we don't have to manage permissions for every user. Instead, we have to create roles, map permissions with them, and then assign those roles to users. All the users who have been assigned a specific role inherit all the permissions mapped to it.

This project is built using Express.js and MongoDB; all the APIs are well-documented using Swagger specification. User authentication has been implemented via JSON Web Tokens and the project is deployed on a DigitalOcean Droplet using Nginx as a web server.

## 2. Roles and Permissions

I have hardcoded a total of 12 permissions that are shared differently between 3 roles - Viewer, Moderator and Admin. Users are allowed to perform certain tasks based on the role they are assigned. Users who haven't been assigned a role don't have any permissions and therefore can't perform any task.

This table encapsulates the relationship between different permissions and roles.

| Permissions             | Viewer | Moderator | Admin |
| :---------------------- | :----: | :-------: | :---: |
| View user               |  Yes   |    Yes    |  Yes  |
| Assign role to user     |   No   |    Yes    |  Yes  |
| Unassign role from user |   No   |    Yes    |  Yes  |
| Activate user           |   No   |    Yes    |  Yes  |
| Deactivate user         |   No   |    Yes    |  Yes  |
| Archive user            |   No   |    Yes    |  Yes  |
| Restore archived user   |   No   |    Yes    |  Yes  |
| Delete user             |   No   |    Yes    |  Yes  |
| View role               |  Yes   |    Yes    |  Yes  |
| Add new role            |   No   |    No     |  Yes  |
| Edit role               |   No   |    No     |  Yes  |
| Delete role             |   No   |    No     |  Yes  |
| Activate role           |   No   |    No     |  Yes  |
| Deactivate role         |   No   |    No     |  Yes  |

## 3. Deployment and Documentation

This project is deployed on a DigitalOcean Droplet and linked to a custom domain. To visit the live deployment, [click here](http://api.rbac.shubhampurwar.in).

APIs are documented using Swagger (OpenAPI) specification and all of them are live and functional. [Click here](http://api.rbac.shubhampurwar.in/docs/swagger) to view API docs. Select RBAC production server in the dropdown menu and play with any API.

[![Documentation Preview](/media/swagger.png)](http://api.rbac.shubhampurwar.in/docs/swagger)

## 4. Main Features

- Authentication enabled using JSON Web Tokens (signup, login, reset password)
- Authorization based on roles and permissions of a user
- APIs are deployed on a DigitalOcean Droplet using Nginx as a web server
- Configured PM2 to keep the API server running as a daemon process to ensure availability
- Utilized the cluster module to evenly distribute incoming requests across all CPU cores in the server
- APIs are documented using Swagger (OpenAPI) specification
- Database modelling using various Mongoose schemas
- Validation of request payload using Joi library
- Logging of HTTP requests using Morgan
- Parsing of multipart/form-data using Formidable library
- Upload and delete images using Cloudinary APIs
- Ability to send emails using Nodemailer
- Routing enabled using Express middlewares
- Centralized error handling using Express middlewares
- Project is based on MVC architecture

## 5. Schemas and Routes

This project consists of 2 schemas and 20+ routes and controllers.

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
| Retrieve users          | GET    | /users                       | Authentication                 |
| Retrieve user by ID     | GET    | /users/:userId               | Authentication + Authorization |
| Delete user             | DELETE | /users/:userId               | Authentication + Authorization |
| Assign role to user     | PUT    | /users/:userId/role/assign   | Authentication + Authorization |
| Unassign role from user | PUT    | /users/:userId/role/unassign | Authentication + Authorization |
| Activate user           | PUT    | /users/:userId/activate      | Authentication + Authorization |
| Deactivate user         | PUT    | /users/:userId/deactivate    | Authentication + Authorization |
| Archive user            | PUT    | /users/:userId/archive       | Authentication + Authorization |
| Restore archived user   | PUT    | /users/:userId/restore       | Authentication + Authorization |

### Role Routes

| Action              | Method | Route                     | Access Requirements            |
| :------------------ | :----- | :------------------------ | :----------------------------- |
| Retrieve all roles  | GET    | /roles                    | Authentication                 |
| Add new role        | POST   | /roles                    | Authentication + Authorization |
| Retrieve role by ID | GET    | /roles/:roleId            | Authentication + Authorization |
| Update role         | PUT    | /roles/:roleId            | Authentication + Authorization |
| Delete role         | DELETE | /roles/:roleId            | Authentication + Authorization |
| Activate role       | PUT    | /roles/:roleId/activate   | Authentication + Authorization |
| Deactivate role     | PUT    | /roles/:roleId/deactivate | Authentication + Authorization |
