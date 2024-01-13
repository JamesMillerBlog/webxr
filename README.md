# WebXR
This repository is a template set up a multiplayer WebXR app.

![webxr](https://github.com/JamesMillerBlog/webxr/assets/12833533/8c81d567-c13c-408d-b020-fd8deef9d73f)
![xr-realtime](https://github.com/JamesMillerBlog/webxr/assets/12833533/31315333-0d60-42d9-a4ea-1b20f4af59f8)


## How to run on localhost
- Install nodejs https://nodejs.org/en/download
- Install yarn ```npm install --global yarn```
- Configure your aws credentials locally (e.g ```aws configure```)
- Clone the repo and then install dependencies with ```yarn install```
- Set up cloud resources for localhost development with ```yarn setup```
- Start localhost development with ```yarn dev```
- Default email address for localhost is ```test@test.com``` and password is ```Test1234!```

## How to deploy an environment
- Follow the above steps
- Deploy Front End ```yarn deploy:client```
- Deploy Back End ``` yarn deploy:server```
