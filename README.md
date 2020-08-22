# Mifos X Credit Scoring Web App

The project consisted of providing an AI powered solution to the users for credit assessment of loans. The project covered various aspects from classical AI, considering various statistical models, to the modern day neural network. The project is enriched with various credit modeling techniques, giving access to the user to choose one or any from them. It also takes care of the different data sources from which data can be fetched and has been fully incorporated to handle data coming from various sources like JSON/XML or SQL.

It is a Single-Page App (SPA) written in standard web technologies [HTML5](http://whatwg.org/html), [SCSS](http://sass-lang.com) and [TypeScript](http://www.typescriptlang.org). It leverages the popular [Angular](https://angular.io/) framework and [Angular Material](https://material.angular.io/) for material design components. The Back End support is provided in Flask [flask](https://flask.palletsprojects.com/en/1.1.x/), a microweb framework written in python. The other components are also written in python version 3.6.8 [python](https://www.python.org/)

## Getting started

1. Ensure you have the following installed in your system:

    [`git`](https://git-scm.com/downloads)

    [`npm`](https://nodejs.org/en/download/)

2. Install [angular-cli](https://github.com/angular/angular-cli) globally.
```
npm install -g @angular/cli@7.3.9
```

3. Clone the project locally into your system.
```
git clone https://github.com/humbletechy/Web-App
```

4. `cd` into project root directory and make sure you are on the master branch.

5. Install the dependencies.
```
npm install
```

6. To preview the app, run the following command and navigate to `http://localhost:4200/`.
```
ng serve
```

The application is using the demo server with basic authentication by default. The credentials for the same are:
 
    Username - mifos
    Password - password

**Important Note:** Please do not make any alterations to these credentials.


### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the
[Angular-CLI README](https://github.com/angular/angular-cli).


## Setting up a local server

You would require python 3.6.8 to run the server locally and a pip version 9.0.3
To install pip use 
`sudo apt-get install python-pip`

To set up server locally you need to install all the requirements listed in requirements.txt. One way to do it is use the following command:  
`pip install -r requirements.txt`

Once you have successfully installed all the dependencies, you need to run main.py file in the project folder by using the following command:
`python main.py`

Your server will be up and running.

## Want to help? [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/openMF/web-app/issues)

Want to file a bug, request a feature, contribute some code, or improve documentation? Excellent! Read up on our guidelines for [contributing](.github/CONTRIBUTING.md) and then check out one of our [issues](https://github.com/openMF/web-app/issues). Make sure you follow the guidelines before sending a contribution!
