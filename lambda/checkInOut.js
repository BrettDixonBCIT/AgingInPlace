
'use strict';

const moment = require('moment-timezone');


var checkInDateTime;
var checkOutDateTime;
var serviceName = "";
const CHECK_IN_PRE = "You have successfully checked in at:  ";
const CHECK_OUT_PRE = "You have successfully checked out at:  ";
const offset = -8;  //default PST Timezone

const checkHandlers = {
    'CheckIn': function () {
        const intentObj = this.event.request.intent;
        serviceName = intentObj.slots.Service.value;
        console.log("Service: ", serviceName);
        if (intentObj.confirmationStatus !== 'CONFIRMED') {
            if (intentObj.confirmationStatus !== 'DENIED') {
                const speechOutput = "You want to check in?";
                const cardTitle = "Check In Confirmation";
                const cardContent = serviceName + ", wishes to check in?";
                const repromptSpeech = speechOutput;
                this.emit(':confirmIntentWithCard', speechOutput, repromptSpeech, cardTitle, cardContent);
            } else {
                this.emit("Okay, no problem.");
            }
        } else {
            this.emit('DoCheckIN');
        }

    },

    'OutCheck': function () {
        this.emit('DoCheckOut');
    },

    'DoCheckIN': function () {
        const cardTitle = 'Care Hub: Check In';
        const d = new moment();
        const checkInDateString = checkInDateTime.toString().slice(0,21);  //only first 21 characters of date
        const cardText = serviceName +" has checked in at:\n"+ checkInDateString;
        const speechOutput = CHECK_IN_PRE + checkInDateString;
        this.emit(':tellWithCard', speechOutput, cardTitle, cardText);
    },

    'DoCheckOut': function () {
        const cardTitle = 'Care Hub: Check Out';
        const d = new Date();
        const utc = d.getTime() + (d.getTimezoneOffset() *60000);
        checkOutDateTime = new Date(utc + (3600000*offset));
        const checkOutDateString = checkOutDateTime.toString().slice(0,21);  //only first 21 characters of date
        const cardText = "Checked out at:\n"+checkOutDateString;

        const speechOutput = CHECK_OUT_PRE + checkOutDateString;
        this.emit(':tellWithCard', speechOutput, cardTitle, cardText);
    }
};

module.exports = checkHandlers;