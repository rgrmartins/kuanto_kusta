# Kuanto Kusta
# Autor: Roger Martins

## Objective
----------------------------------------------------------------
Project created with NodeJS with the objectives:
- Create a new product;
- Create stock with product, making possible, to reserve, to unreserve or sold this product;


## Start this Project
----------------------------------------------------------------
### First all
- Clone this project and in terminal in folder this project run `yarn` to install all dependencies
- We need start the docker:
  - Run this command in terminal in folder this project and with docker started `docker-compose up -d`
- After it we need run the migration command to create our tables `npx prisma migrate dev`
----------------------------------------------------------------
### Commands
  - `yarn dev` - It will start the project and make the endpoints available
  - `yarn test:functional` - Will run the application tests
----------------------------------------------------------------
### Observation
  - There is a postman collection at the root of the project with the endpoint tests I used to develop the project
