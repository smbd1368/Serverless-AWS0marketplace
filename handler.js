const AWS = require('aws-sdk')
'use strict';

module.exports.hello = async event => {

  console.log("mehrdadr13")
  return {
    statusCode: 401,
    body: JSON.stringify(
      {
        message: 'unauthorize',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

