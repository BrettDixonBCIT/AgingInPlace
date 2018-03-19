'use strict';
const Alexa = require('alexa-sdk');
const pg = require("pg");
const { Pool } = require('pg');
const crypto = require('crypto');
var token = "";
var testRes = true;

const pool = new Pool({
 user: 'dbmaster',
 password: 'acit4900superultrasecret',
 database: 'alexadb',
 host: 'alexa-db-4900.ctkswblntwwe.us-east-1.rds.amazonaws.com',
 port: 5432
});

exports.handler = function(event, context, callback) {
 const alexa = Alexa.handler(event, context, callback);
 context.callbackWaitsForEmptyEventLoop = false;
 alexa.appId = "amzn1.ask.skill.07c3dcba-6f1e-4ea0-9652-bba3e826a363";
 alexa.registerHandlers(creatingHandlers);
 alexa.execute();
};

const creatingHandlers = {

   'AMAZON.HelpIntent': function () {
       const speechOutput = 'Creates a role.';

       this.response.speak(speechOutput);
       this.emit(':responseReady');
   },
   'AMAZON.CancelIntent': function () {
       this.response.speak('Goodbye!');
       this.emit(':responseReady');
   },
   'AMAZON.StopIntent': function () {
       this.response.speak('See you later!');
       this.emit(':responseReady');
   },
   'CreateRole': function () {
     var self = this;
     var codeArr = [];
     pool.connect((err, client, release) => {
       if (err) {
         return console.error('Error acquiring client', err.stack)
       }
       client.query("SELECT ccode FROM seniors", (err, result) => {
           console.log(testRes);
           console.log(codeArr);
           while(testRes){
               if(token in codeArr || token == ''){
                   console.log("was a truey");
                   crypto.randomBytes(6, function(err, buffer) {
                       token = buffer.toString('base36');
                       console.log(token);
                       testRes = true;
                   })
               } else {
                   console.log("before insert (also known as a falsy)");
                   client.query("INSERT INTO seniors (ccode) VALUES ($1)",[token], (err, result) => {
                       self.response.speak('Senior reference code has been created.');
                       self.emit(':responseReady');
                       release();
                       if (err) {
                           return console.error('Error executing query', err.stack)
                           console.log(err)
                       }
                       testRes = false;
                   })
               }
           }
       });
     });
   }
};