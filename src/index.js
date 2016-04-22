/**
 * App ID for the skill
 */
var APP_ID = "amzn1.echo-sdk-ams.app.d0aad8a4-1d12-4eca-920f-0a167ad96b3e";
/* Array containing koans.
 */
var ZEN_KOANS = [
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
  "The great Way is not difficult, if you just don’t pick and choose",
  "A monk told Joshu, 'I have just entered this monastery. I beg you to teach me.' Joshu asked, 'Have you eaten your rice porridge?' The monk replied, 'I have.' 'Then,' said Joshu, 'Go and wash your bowl.' At that moment the monk was enlightened."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * FindYourZen is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var ZenKoan = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ZenKoan.prototype = Object.create(AlexaSkill.prototype);
ZenKoan.prototype.constructor = ZenKoan;

ZenKoan.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("ZenKoan onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

ZenKoan.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("ZenKoan onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewKoanRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
ZenKoan.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("ZenKoan onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

ZenKoan.prototype.intentHandlers = {
    "GetNewKoanIntent": function (intent, session, response) {
        handleNewKoanRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask Find Your Zen tell me a koan, or, you can say exit... What can I help you with?", "What can I help you with?");
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
function handleNewKoanRequest(response) {
    // Get a random koan from a list of koans
    var koanIndex = Math.floor(Math.random() * ZEN_KOANS.length);
    var koan = ZEN_KOANS[koanIndex];

    // Create speech output
    var speechOutput = "Reflect on this koan: " + koan;

    response.tellWithCard(speechOutput, "ZenKoan", speechOutput);
}

//add possible repeat functionality
function handleRepeatRequest(intent, session, callback) {
    // Repeat the previous speechOutput and repromptText from the session attributes if available
    // else start a new game session
    if (!session.attributes || !session.attributes.speechOutput) {
        getWelcomeResponse(callback);
    } else {
        callback(session.attributes,
            buildSpeechletResponseWithoutCard(session.attributes.speechOutput, session.attributes.repromptText, false));
    }
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the ZenKoan skill.
    var ZenKoan = new ZenKoan();
    zenKoan.execute(event, context);
};
