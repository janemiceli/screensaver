/*jslint browser */
/*global window */
const messages = ["TIM", "ARIA", "CONNOR", "JANE", "MICELI"];

var pinkrain = 0;
var orangerain = 25;
var yellowrain = 50;
var greenrain = 104;
var bluerain = 207;
var purplerain = 255;

var colorrain = bluerain;

var M = {
    COLUMNS: null,
    HEIGHT: window.innerHeight,
    WIDTH: window.innerWidth,
    animation: null,
    assignColumn: function() {
        "use strict";
        var randomColumn = M.randomFromInterval(0, (M.COLUMNS - 1));
        return randomColumn;
    },
    c: null,
    canvii: [],
    checkArray: function(codeLength, messages, column, lettersLength) {
        "use strict";
        var item = messages[Math.floor(Math.random()*(messages.length))];
        if (item.length == codeLength - 1) {
                M.insertCustomMessages(codeLength, item, column);
            } else {
                M.randomMessage(codeLength, column, lettersLength);
        }
    },
    codes: [],
    codesCounter: 0,
    createCanvii: function(i) {
        "use strict";
        var j;
        var text;
        var fadeStrength;
        var codeLen = M.codes[i].length - 1;
        var canvHeight = codeLen * M.settings.COL_HEIGHT;
        var velocity = M.codes[i][0].velocity;
        var strength = M.codes[i][0].strength;
        var newCanv = document.createElement("canvas");
        var newCtx = newCanv.getContext("2d");
        newCanv.width = M.settings.COL_WIDTH;
        newCanv.height = canvHeight;
        newCtx.shadowOffsetX = 0;
        newCtx.shadowOffsetY = 0;
        newCtx.shadowBlur = 0;
        newCtx.globalCompositeOperation = "source-over";
        newCtx.font = "30px matrix-code";
        if (i % 2 === 1) {
            for (j = 1; j < codeLen; j += 1) {
                text = M.codes[i][j];
                if (j < 3) {
                    newCtx.shadowColor = "hsla(" + colorrain + ", 79%, 72%)";
                    newCtx.shadowBlur = 3;
                    newCtx.fillStyle = "hsla(" + colorrain + ", 79%, " + (100 - (j * 3)) + "%, " + strength + ")";
                } else if (j > (codeLen - 3)) {
                    fadeStrength = 1 - (j / codeLen);
                    newCtx.fillStyle = "hsla(" + colorrain + ", 79%, 74%, " + (fadeStrength + 0.3) + ")";
                } else {
                    newCtx.fillStyle = "hsla(" + colorrain + ", 79%, 74%, " + strength + ")";
                }
                newCtx.fillText(text, 0, (canvHeight - (j * M.settings.COL_HEIGHT)));
            }
        } else {
            for (j = codeLen; j > 0; j -= 1) {
                text = M.codes[i][j];
                if (j < (codeLen - 3)) {
                    newCtx.shadowColor = "hsla(" + colorrain + ", 79%, 72%)";
                    newCtx.shadowBlur = 3;
                    newCtx.fillStyle = "hsla(" + colorrain + ", 79%, " + (j * 3) + "%, " + strength + ")";
                } else if (j < 3) {
                    fadeStrength = 1 - (j / codeLen);
                    newCtx.fillStyle = "hsla(" + colorrain + ", 79%, 74%, " + (fadeStrength + 0.3) + ")";
                } else {
                    newCtx.fillStyle = "hsla(" + colorrain + ", 79%, 74%, " + strength + ")";
                }
                newCtx.fillText(text, 0, (canvHeight - (j * M.settings.COL_HEIGHT)));
            }
        }
        M.codes[i][0].canvas = newCanv;
    },
    createCode: function() {
        "use strict";
        var randomInterval = M.randomFromInterval(0, 100);
        var column = M.assignColumn();
        var codeLength = 0;
        var i = 0;
        var reverseString = "";
        var codeVelocity = (Math.random() * (M.settings.VELOCITY_PARAMS.max - M.settings.VELOCITY_PARAMS.min)) + M.settings.VELOCITY_PARAMS.min;
        var lettersLength = M.letters.length;
        var newLetter = 0;
        clearTimeout(M.createCodeLoop);
        if (column) {
            codeLength = M.randomFromInterval(M.settings.CODE_LENGTH_PARAMS.min, M.settings.CODE_LENGTH_PARAMS.max);
            M.codes[column][0].position = {
                "x": (column * M.settings.COL_WIDTH),
                "y": 0
            };
            M.codes[column][0].velocity = codeVelocity;
            M.codes[column][0].strength = M.codes[column][0].velocity / M.settings.VELOCITY_PARAMS.max;
            M.checkArray(codeLength, messages, column, lettersLength);
            M.createCanvii(column);
            M.codesCounter += 1;
        }
        M.createCodeLoop = setTimeout(M.createCode, randomInterval);
    },
    createCodeLoop: null,
    createLines: function() {
        "use strict";
        var linesYBlack = 0;
        var linesYWhite = 0;
        M.linesC = document.createElement("canvas");
        M.linesC.width = M.WIDTH;
        M.linesC.height = M.HEIGHT;
        M.linesC.style.position = "absolute";
        M.linesC.style.top = 0;
        M.linesC.style.left = 0;
        M.linesC.style.zIndex = 10;
        document.body.appendChild(M.linesC);
        M.ctx2 = M.linesC.getContext("2d");
        M.ctx2.beginPath();
        M.ctx2.lineWidth = 1;
        M.ctx2.strokeStyle = "rgba(0, 0, 0, 0.7)";
        while (linesYBlack < M.HEIGHT) {
            M.ctx2.moveTo(0, linesYBlack);
            M.ctx2.lineTo(M.WIDTH, linesYBlack);
            linesYBlack += 5;
        }
        M.ctx2.lineWidth = 0.15;
        M.ctx2.strokeStyle = "rgba(255, 255, 255, 0.7)";
        while (linesYWhite < M.HEIGHT) {
            M.ctx2.moveTo(0, linesYWhite + 1);
            M.ctx2.lineTo(M.WIDTH, linesYWhite + 1);
            linesYWhite += 5;
        }
        M.ctx2.stroke();
    },
    ctx: null,
    ctx2: null,
    draw: function() {
        "use strict";
        var velocity;
        var height;
        var x;
        var y;
        var c;
        var ctx;
        var i = 0;
        M.ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        M.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        M.ctx.fillRect(0, 0, M.WIDTH, M.HEIGHT);
        M.ctx.globalCompositeOperation = "source-over";
        for (i = 0; i < M.COLUMNS; i += 1) {
            if (M.codes[i][0].canvas) {
                velocity = M.codes[i][0].velocity;
                height = M.codes[i][0].canvas.height;
                x = M.codes[i][0].position.x;
                y = M.codes[i][0].position.y;
                c = M.codes[i][0].canvas;
                ctx = c.getContext("2d");
                if (i % 2 === 0) { //rain that goes from the bottom of the screen up
                    y = y + height;
                    M.ctx.drawImage(c, x, y, M.settings.COL_WIDTH, height);
                    if ((M.codes[i][0].position.y + height) < M.HEIGHT) {
                        M.codes[i][0].position.y -= velocity;
                    } else {
                        M.codes[i][0].position.y = M.HEIGHT;
                    }
                } else { //rain that goes from top to bottom
                    y = y - height;
                    M.ctx.drawImage(c, x, y, M.settings.COL_WIDTH, height);
                    if (y < M.HEIGHT) {
                        M.codes[i][0].position.y += velocity;
                    } else {
                        M.codes[i][0].position.y = 0;
                    }
                }
            }
        }
    },
    init: function() {
        "use strict";
        var i = 0;
        if (typeof window.G_vmlCanvasManager !== "undefined") {
            M.c = window.G_vmlCanvasManager.initElement("canvas");
        } else {
            M.c = document.getElementById("canvas");
        }
        M.ctx = M.c.getContext("2d");
        M.c.width = M.WIDTH;
        M.c.height = M.HEIGHT;
        M.ctx.shadowBlur = 0;
        M.ctx.fillStyle = "#000";
        M.ctx.fillRect(0, 0, M.WIDTH, M.HEIGHT);
        M.ctx.font = M.font;
        M.COLUMNS = Math.ceil(M.WIDTH / M.settings.COL_WIDTH);
        for (i = 0; i < M.COLUMNS; i += 1) {
            M.codes[i] = [];
            M.codes[i][0] = {
                "open": true,
                "position": {
                    "x": 0,
                    "y": 0
                },
                "strength": 0
            };
        }
        M.loop();
        M.createLines();
        M.createCode();
        window.onresize = function() {
            window.cancelAnimationFrame(M.animation);
            M.animation = null;
            M.ctx.clearRect(0, 0, M.WIDTH, M.HEIGHT);
            M.codesCounter = 0;
            M.ctx2.clearRect(0, 0, M.WIDTH, M.HEIGHT);
            M.WIDTH = window.innerWidth;
            M.HEIGHT = window.innerHeight;
            M.init();
        };
    },
    insertCustomMessages: function(codeLength, message, column) {
        "use strict";
        var i = 0;
        var reverseString;
        for (i = 1; i <= codeLength; i = i + 1) {
            reverseString = message.split("").reverse().join("");
            M.codes[column][i] = reverseString.substring(i - 1, i);
        }
    },
    letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "+", "-", "*", "/", "=", "%", "#", "&", "_", "(", ")", ",", ".", ";", ":", "?", "!", "\\", "|", "{", "}", "<", ">", "[", "]", "^ ", "~", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " "],
    lineC: null,
    loop: function() {
        "use strict";
        M.animation = window.requestAnimationFrame(function() {
            M.loop();
        });
        M.draw();
    },
    randomFromInterval: function(from, to) {
        "use strict";
        return Math.floor(Math.random() * (to - from + 1) + from);
    },
    randomMessage: function(codeLength, column, lettersLength) {
        "use strict";
        var i = 0;
        var newLetter;
        for (i = 1; i <= codeLength; i += 1) {
            newLetter = M.randomFromInterval(0, (lettersLength - 1));
            M.codes[column][i] = M.letters[newLetter];
        }
    },
    settings: {
        CODE_LENGTH_PARAMS: {
            max: 30,
            min: 3
        },
        COL_HEIGHT: 25,
        COL_WIDTH: 20,
        VELOCITY_PARAMS: {
            max: 2,
            min: 1
        }
    },
    snapshot: function() {
        "use strict";
        window.open(M.c.toDataURL());
    },
    swapCharacters: function() {
        "use strict";
        var randomCodeIndex;
        var randomCode;
        var randomCodeLen;
        var randomCharIndex;
        var newRandomCharIndex;
        var newRandomChar;
        randomCodeIndex = M.randomFromInterval(0, (M.codes.length - 1));
        randomCode = M.codes[randomCodeIndex];
        randomCodeLen = randomCode.length;
        randomCharIndex = M.randomFromInterval(2, (randomCodeLen - 1));
        newRandomCharIndex = M.randomFromInterval(0, (M.letters.length - 1));
        newRandomChar = M.letters[newRandomCharIndex];
        randomCode[randomCharIndex] = newRandomChar;
        M.swapCharacters();
    }
};
window.onload = function() {
    "use strict";
    M.init();
};
