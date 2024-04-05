# Star Wars Test 🚀

## ⭐Overview ⭐

This project is a serverless application for interacting with Star Wars planet data. It provides endpoints for retrieving planet information, creating new planets, and importing planets from the Star Wars API.

## Prerequisites 💫

Before running the application, make sure you have the following installed:

- Node.js
- npm
- Serverless Framework

## Installation 🛰️

Clone the repository and install dependencies:

```bash
$ git clone <repository_url>
$ cd starwarstest
$ npm install
```

## Local Testing 👩‍🚀

Test the application locally by using Serverless Framework's invoke command:

### Test `get` GET request

```bash
$ serverless invoke local --function get --path test/get.json
```

### Test `create` POST request

```bash
$ serverless invoke local --function create --path test/post.json
```

### Test `import` POST request

```bash
$ serverless invoke local --function import --path test/import.json
```

## Deployment 📡

Deploy the application using the Serverless Framework:

```bash
$ serverless deploy
```
