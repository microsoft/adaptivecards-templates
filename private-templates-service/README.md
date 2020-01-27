# Running the Adaptive Cards Admin Portal Locally

To run this web application locally, you must have the following installed on your system:

-   Git
-   [Node v12](https://nodejs.org/en/download/)

**1. Clone the repository.**

**2. Depending on what environment you would like to run locally (master, stage or dev), switch to the appropriate branch.**

**3. Modify the `Config.tsx` file.**

The Adaptive Cards Admin Portal lives under `adaptivecards-templates/private-templates-service`.
Modify the file `adaptivecards-templates/private-templates-service/client/src/Config.tsx` such that the redirectUri points to `http:\\localhost:3000`.

**4. Inside of `adaptivecards-templates/private-templates-service/client` run `npm install`.**

**5. Finally, run ``npm start` to launch the application in your default browser.**

**You're good to go!**

## Troubleshooting

-   When running `npm start`, confirm in your shell that the localhost port matches the port in the `Config.tsx` redirectUri. It should be port 3000 but it can be different.

# Nodejs download on WSL

1. To download compatable nodejs, npm

```
sudo apt-get autoremove --purge npm node nodejs
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

# Linting and Code Convention Setup for VSCode

**1. Download the following extensions for VSCode:**

-   ESLint
-   Prettier - Code formatter
-   Babel ES6/ES7

The project is setup to contain a .vscode folder with all the setting configuration for these VSCode extension.

**2. To install all node modules needed for code formatting on save:**

```
npm install
```

At this point, ESLint and Prettier should work in conjuction to auto-format all files on save.
A restart of VScode may be required.

## Confirm Valid Setup

To confirm that you are setup correctly, open a js file in the repository and write the following:

```
const l = [1,2,3,
4,    5,
6];
```

Once you save the file, this line of code should be code formatted as below:

```
const l = [1, 2, 3, 4, 5, 6];
```

## Troubleshooting

Things to watch out for:

-   You **must** have auto-saving turned off on VSCode. Saving needs to be manually triggered.
-   Make sure you are accessing the repo by opening the repository folder in VSCode rather than particular files in the repository. To do so, in VSCode, go to File -> Open Folder and open the adaptivecards-templates folder.
