# Nodejs download on WSL

1. To download compatable nodejs, npm

```
sudo apt-get autoremove --purge npm node nodejs
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

# Linting and Code Convention Setup for VSCode

1. Download the following extensions for VSCode:

-   ESLint
-   Prettier - Code formatter
-   Babel ES6/ES7

The project is setup to contain a .vscode folder with all the setting configuration for these VSCode extension.

2. To install all node modules needed for code formatting on save:

```
npm install
```

At this point, ESLint and Prettier should work in conjuction to auto-format all files on save.
A restart of VScode may be required.
