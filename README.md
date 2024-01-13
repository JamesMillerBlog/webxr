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
   - At this point the CLI will ask you a series of questions to set up your project
   - When it comes to providing the domain name be sure you own this within the AWS account you are setting up 
- Start localhost development with ```yarn dev```
- Default email address for localhost is ```test@test.com``` and password is ```Test1234!``` (***intended for localhost only, be sure to delete this in cognito if deploying to a live environment***)

## How to deploy an environment
- Follow the above steps
- Deploy Front End ```yarn deploy:client```
- Deploy Back End ``` yarn deploy:server```

## How to setup with CI
- In your Github repo where you have cloned this codebase, go to your Settings
- Within Secrets and variables, select Actions and then create Repository secrets for:
   - ```AWS_ACCESS_KEY_ID```
   - ```AWS_REGION```
   - ```AWS_SECRET_ACCESS_KEY```
   - ```PULUMI_CONFIG_PASSPHRASE```
- Click on the Actions tab, select Deploy on the left side and then on 'Run workflow' to see deployment options
- Select which branch, stack, domain-name and project-name you want to deploy, for example:
   - stack: ```dev```
   - domain-name: ```dev.jamesmiller.blog```
   - project-name: ```webxr-project```
