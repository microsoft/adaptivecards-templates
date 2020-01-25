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
