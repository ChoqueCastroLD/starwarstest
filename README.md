# starwarstest


Test locally
```
$ git clone
$ cd starwarstest
$ npm install

# Test get GET request
$ serverless invoke local --function get --path test/get.json

# Test create POST request
$ serverless invoke local --function create --path test/post.json

# Test import POST request
$ serverless invoke local --function import --path test/import.json
```
