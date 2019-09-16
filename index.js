// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sql = require('mssql');

var config = {
    user: "****",
    password: "*****",
    server: "*****",
    port: ****,
    database: "*****"
};

var conn = new sql.ConnectionPool(config);

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Michigan Football!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const StatsHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'dataSelector';
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say  = "";
        let queryInput = "select ";

        function sqlQueryFact(inputString, fact) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        stringMan =  answers.recordset[0][fact];
                        conn.close();
                        resolve(stringMan);
                    })
                });
            });

        }

        function sqlQueryTouchdowns(inputString) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        addition =  Number(answers.recordset[0]["touchdowns"]) + Number(answers.recordset[0]["touchdownsRushing"]) + Number(answers.recordset[0]["touchdownsRecieving"]);
                        stringMan = addition.toString();
                        conn.close();
                        resolve(stringMan);
                    })
                });
            });

        }

        function sqlQueryWeek(inputString) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        stringMan =  answers.recordset[0][""];
                        conn.close();
                        resolve(stringMan);
                    })
                });
            });

        }

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);

        if (slotValues && slotValues.players && slotValues.data && slotValues.week) {
            var player = request.intent.slots.players.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var data = request.intent.slots.data.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var game = request.intent.slots.week.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var teamName = request.intent.slots.week.resolutions.resolutionsPerAuthority[0].values[0].value.id;
            var tempSlotFact = "";
            var weekQuery = "SELECT MAX(weekIndex) FROM Players"
            var maxWeek = await sqlQueryWeek(weekQuery)
            var gameNumber = game.toString()
            var maxWeekNumber = maxWeek.toString()
            
            if( gameNumber > maxWeekNumber){
                say = "Michigan has not played that game yet"
                return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
            }

            if(data == 'touchdowns'){
                queryInput = queryInput + "touchdowns, touchdownsRushing, touchdownsRecieving"
            }
            else{
                queryInput = queryInput + data;
            }

            queryInput = queryInput +  " from Players where fullname = '";
            queryInput = queryInput + player;
            queryInput = queryInput +  "' and weekIndex = '";
            queryInput = queryInput + game;
            queryInput = queryInput +  "'";

            var first;

            if(data == 'touchdowns'){
                first = await sqlQueryTouchdowns(queryInput);
            }
            else{
                first = await sqlQueryFact(queryInput, data);
            }
            var slot_fact = data

            if(first == '1')
            {
                slot_fact = slot_fact.substring(0, (slot_fact.length - 1));
            }

            say = player + " had " + first + " " + slot_fact + " against " + teamName

            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();


        } 
        
        
        else {
            say = "Please ask about a player";
            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
        }
    }
};

const LastWeekStatsHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'lastWeekDataSelector';
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say  = "";
        let queryInput = "select ";

        function sqlQueryFact(inputString, fact) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        stringMan =  answers.recordset[0][fact];
                        conn.close();
                        resolve(stringMan);
                    })
                });
            });

        }

        function sqlQueryTouchdowns(inputString) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        addition =  Number(answers.recordset[0]["touchdowns"]) + Number(answers.recordset[0]["touchdownsRushing"]) + Number(answers.recordset[0]["touchdownsRecieving"]);
                        stringMan = addition.toString();
                        conn.close();
                        resolve(stringMan);
                    })
                });
            });

        }

        function sqlQueryWeek(inputString) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        stringMan =  answers.recordset[0][""];
                        conn.close();
                        resolve(stringMan);
                    })
                });
            });

        }

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);

        if(slotValues && slotValues.players && slotValues.data)
        {
            
            var player = request.intent.slots.players.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var data = request.intent.slots.data.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var tempSlotFact = "";

            if(data == 'touchdowns'){
                queryInput = queryInput + "touchdowns, touchdownsRushing, touchdownsRecieving"
            }
            else{
                queryInput = queryInput + data;
            }

            var weekQuery = "SELECT MAX(weekIndex) FROM Players"
            var maxWeek = await sqlQueryWeek(weekQuery);

            queryInput = queryInput +  " from Players where fullname = '";
            queryInput = queryInput + player;
            queryInput = queryInput +  "' and weekIndex = '";
            queryInput = queryInput + maxWeek;
            queryInput = queryInput +  "'";

            var first;

            if(data == 'touchdowns'){
                
                first = await sqlQueryTouchdowns(queryInput);
            }
            else{
               
                first = await sqlQueryFact(queryInput, data);
            }
            
            var slot_fact = data

            if(first == '1')
            {
                slot_fact = slot_fact.substring(0, (slot_fact.length - 1));
            }

            say = player + " had " + first + " " + slot_fact + " last week."

            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
        }
        
        else {
            say = "Please ask about a player";
            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
        }
    }
};

const MostStatsHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'mostDataSelector';
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say  = "";

        function sqlQueryMax(inputString, data) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        vectorAnswers =  [answers.recordset[0]['fullName'], answers.recordset[0][data]];
                        conn.close();
                        resolve(vectorAnswers);
                    })
                });
            });

        }

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);

        if(slotValues &&slotValues.data)
        {
            
            var data = request.intent.slots.data.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var tempSlotFact = "";

            var queryInput = "SELECT fullName, "
;

            queryInput = queryInput +  data;
            queryInput = queryInput + " FROM SeasonStats WHERE ";
            queryInput = queryInput +  data;
            queryInput = queryInput + " = (SELECT MAX(";
            queryInput = queryInput +  data;
            queryInput = queryInput +  " ) FROM SeasonStats)";

            var maxStats = await sqlQueryMax(queryInput, data)

            say = "This season " + maxStats[0] + " leads the team with " + maxStats[1]  + " " + data;

            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
        }
        
        else {
            say = "Please ask about a player";
            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
        }
    }
};

const PlayerStatsHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'playerDataSelector';
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say  = "";

        function sqlQueryMax(inputString, data) {
            return new Promise(function(resolve) {
                var conn = new sql.ConnectionPool(config);
                stringMan = "";
                conn.connect().then(function() {
                    var req = new sql.Request(conn);
                    req.query(inputString).then(function(answers) {
                        vectorAnswers =  [answers.recordset[0]['fullName'], answers.recordset[0][data]];
                        conn.close();
                        resolve(vectorAnswers);
                    })
                });
            });

        }

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);

        if(slotValues && slotValues.data && slotValues.player)
        {
            
            var data = request.intent.slots.data.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var name = request.intent.slots.player.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            var tempSlotFact = "";
           
            var queryInput = "SELECT fullName, "
;

            queryInput = queryInput +  data;
            queryInput = queryInput + " FROM SeasonStats WHERE fullName = '";
            queryInput = queryInput +  name;
            queryInput = queryInput +  "'";


            var maxStats = await sqlQueryMax(queryInput, data)
           
            say = "This season " + maxStats[0] + " has " + maxStats[1]  + " " + data;
           
            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
        }
        
        else {
          
            say = "Please ask about a player";
            return handlerInput.responseBuilder
                .speak(say)
                .reprompt(say)
                .getResponse();
        }
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent' ||
                Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};


// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, there are no stats available for the question!`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

function getSlotValues(filledSlots) {
    const slotValues = {};

    Object.keys(filledSlots).forEach((item) => {
        const name = filledSlots[item].name;

        if (filledSlots[item] &&
            filledSlots[item].resolutions &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
            switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
                case 'ER_SUCCESS_MATCH':
                    slotValues[name] = {
                        heardAs: filledSlots[item].value,
                        resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
                        ERstatus: 'ER_SUCCESS_MATCH'
                    };
                    break;
                case 'ER_SUCCESS_NO_MATCH':
                    slotValues[name] = {
                        heardAs: filledSlots[item].value,
                        resolved: '',
                        ERstatus: 'ER_SUCCESS_NO_MATCH'
                    };
                    break;
                default:
                    break;
            }
        } else {
            slotValues[name] = {
                heardAs: filledSlots[item].value || '', // may be null 
                resolved: '',
                ERstatus: ''
            };
        }
    }, this);

    return slotValues;
}

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        StatsHandler,
        LastWeekStatsHandler,
        PlayerStatsHandler,
        MostStatsHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();