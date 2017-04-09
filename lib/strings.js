module.exports = {
  bitBucketAPIUrl: 'https://api.bitbucket.org/2.0/repositories',
  contentTypeJSON: 'Content-Type: application/json',
  curlOptions: 'curl --write-out "%{http_code}\n" --silent --output POST -H',
  cp: 'slkdjSDFGSD-sqwerDDASKDfasdlkjasd329-982376-sdS',
  cal: 'aes192',
  errors: {
    username: 'Please provide a non empty and valid BitBucket user name.',
    cachePassword: 'Error. You indicated wanting to cache your password without providing a default username in your config file.',
    unknownPasswordType: 'Error. The value stored in the user password property in your config file should be set to null or type String.',
    destinationBranch: 'Please provide a default branch in your config file or provide a non empty destination branch.'

  }
}
