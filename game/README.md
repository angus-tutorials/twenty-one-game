# Game

## Overview

A flask application for playing the game 21 using Kubernetes pods as players

This project contains the code for the Python Flask app and the React front end. These are stored in `app` and `react-frontend` respectively

## Building React

The React application in `react-frontend` has been configured to build directly into the flask application in the correct place, if you make changes to the React app and you're ready to deploy run the command...

```bash
npm run build
```

and all the static content will be deployed into flasks `app` directory

## Running Flask

To run the flask application simply use the `Makefile` and visit http://localhost:5000 to view the app

*`Note`* The application does not currently work on a local machine as the player config map is not present

