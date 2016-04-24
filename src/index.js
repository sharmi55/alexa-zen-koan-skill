/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask FindYourZen for a koan"
 *  Alexa: "Here's your koan: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.d6c2b985-5945-43f9-aec2-f441d7f6365a";

/* Array containing koans.
 */

var ZEN_KOANS = [
  "Stop the war.",
  "Save a ghost",
  "Who is hearing this sound?",
  "Sickness and medicine are in accord with each other. The whole world is medicine. What am I?",
  "If you turn things around you are like the Buddha.",
  "There is a true person of no rank who is constantly coming and going from the portals of your face. Who is that true person of no rank?",
  "A student asked Zhaozhou, “Does a dog have Buddha Nature?” Zhaozhou said, 'No.'",
  "In the sea, ten thousand feet down, there’s a single stone. I’ll pick it up without wetting my hands.",
  "When you paint Spring, do not paint willows, plums, peaches, or apricots, but just paint Spring. To paint willows, plums, peaches, or apricots is to paint willows, plums, peaches, or apricots - it is not yet painting Spring.",
  "The fundamental delusion of humanity is to suppose that I am here and you are out there.",
  "What was your original face, the one you had before your parents gave birth to you?",
  "When you can do nothing, what can you do?",
  "What is the color of wind?",
  "Be master of mind rather than mastered by mind.",
  "When an ordinary man attains knowledge, he is a sage; when a sage attains understanding, he is an ordinary man.",
  "The journey of a thousand miles begins with a single step.",
  "The way is to be warm in winter and cool in summer.",
  "Give up all concerns. Allow the multitude to rest.",
  "Water which is too pure has no fish.",
  "A heavy snowfall disappears into the sea. What silence!",
  "Nothing in the cry of cicadas suggests they are about to die",
  "I have something. When you look at it, it's there, but when you look for it, it's not. What is it?",
  "You can make the sound of two hands clapping. Now what is the sound of one hand?",
  "When the many are reduced to one, to what is the one reduced?",
  "Shuzan held out his short staff and said, “If you call this a short staff, you oppose its reality. If you do not call it a short staff, you ignore the fact. Now what do you wish to call this?”",
  "A monk asked Kegon, 'How does an enlightened one return to the ordinary world?' Kegon replied, 'A broken mirror never reflects again; fallen flowers never go back to the old branches.' ",
  "Zen Master Unmon said: 'The world is vast and wide. Why do you put on your robes at the sound of a bell?' ",
  "A monk asked Master Haryo, 'What is the way?' Haryo said, 'An open-eyed man falling into the well.' ",
  "Ummon Zenji said: 'Men of immeasurable greatness are tossed about in the ebb and flow of words.' ",
  "A monk asked Chimon, 'Before the lotus blossom has emerged from the water, what is it?' Chimon said, 'A lotus blossom.' The monk pursued, 'After it has come out of the water, what is it?' Chimon replied, 'Lotus leaves.' ",
  "If a tree falls in the forest does it make a sound?",
  "If you practice sitting as Buddha, you must kill Buddha.",
  "What do you call the world?",
  "Out of nowhere, the mind comes forth.",
  "What moves: the flag or the wind?",
  "If you are unable to find the truth right where you ar, where else do you expect to find it?",
  "A monk told Joshu, 'I have just entered this monastery. I beg you to teach me.' Joshu asked, 'Have you eaten your rice porridge?' The monk replied, 'I have.' 'Then,' said Joshu, 'Go and wash your bowl.' At that moment the monk was enlightened.",
  "The coin lost in the river is found in the river.",
  "The great Way is not difficult if you just do not pick and choose"

];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SpaceGeek = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SpaceGeek.prototype = Object.create(AlexaSkill.prototype);
SpaceGeek.prototype.constructor = SpaceGeek;

SpaceGeek.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("FindYourZen onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SpaceGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("FindYourZen onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SpaceGeek.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("FindYourZen onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SpaceGeek.prototype.intentHandlers = {
    "GetNewKoanIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Find Your Zen 'tell me a koan', or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new koan from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random koan from the language facts list
    var factIndex = Math.floor(Math.random() * ZEN_KOANS.length);
    var fact = ZEN_KOANS[factIndex];

    // Create speech output
    var speechOutput = "Now, for your reflection: " + fact;

    response.tellWithCard(speechOutput, "FindYourZen", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the FindYourZen skill.
    var spaceGeek = new SpaceGeek();
    spaceGeek.execute(event, context);
};
