const HT16K33 = require("./HT16K33");
const { Utils } = require("../utils");
const { SEVEN_SEGMENT } = require("./sevenSegment");

async function smallWait() {
    switch (2) {
        case 1: {
            await Utils.readFromConsole(`Press [enter] to continue...`);
            break;
        }
        case 2: {
            await Utils.delay(300); // 200 (too fast), 500 (too slow)
            break;
        }
        case 3: {
            await Utils.delay(0);
            break;
        }
        default:
            throw new Error("Invalid option");
            break;
    }
}

async function testSegments(ht16k33) {
    let data;
    for (const segment of "abcdefg8 ") {
        let hasDP = false;
        let hasColon = false;
        for (let i = 0; i <= 3; i++) {
            switch (i) {
                case 0: {
                    hasDP = false;
                    hasColon = false;
                    break;
                }
                case 1: {
                    hasDP = false;
                    hasColon = true;
                    break;
                }
                case 2: {
                    hasDP = true;
                    hasColon = false;
                    break;
                }
                case 3: {
                    hasDP = true;
                    hasColon = true;
                    break;
                }
                default:
                    console.log("ERROR!!!!");
                    break;
            }
            data = SEVEN_SEGMENT.displaySegment(segment, hasDP, hasColon);
            console.log(`[SEGMENT]${hasDP ? "[DP]" : ""}${hasColon ? "COLON" : ""}[${segment}]`);
            await ht16k33.writeData(data);
            await smallWait();
        }
    }
}

async function testBrightness(ht16k33) {
    for (let i = -1; i <= 4; i++) {
        let brightness = 5 * i; // [-5 ~ 20], but function should correct to [0 ~ 15]
        await ht16k33.setBrightness(brightness);
        await ht16k33.writeData(SEVEN_SEGMENT.displayCharacters("8.8.:8.8."));
        await smallWait();
    }
}

async function testCharacters(ht16k33) {
    let data = null;
    let allCharacters = `   0123456789AbCcdEFGHhIiJLnOoPrStUuY=_'"[]°   `;
    for (let i = 0; i < allCharacters.length - 3; i++) {
        data = SEVEN_SEGMENT.displayCharacters(allCharacters.substr(i, 4));
        await ht16k33.writeData(data);
        await smallWait();
    }
}

async function writeWords(ht16k33) {
    let words = {
        text: "    ",
        index: 0
    }

    async function writeWord(word, isSpacerVisible = true) {
        if (isSpacerVisible) {
            word += " = ";
        }
        words.text += word;
        for (let i = 0; i < word.length; i++) {
            let letters = `${words.text}   `.substr(words.index, 4);
            words.index++;
            data = SEVEN_SEGMENT.displayCharacters(letters);
            await ht16k33.writeData(data);
            await smallWait();
        }
    }

    await writeWord("HI");
    await writeWord("HELLO");
    await writeWord("HOLA");

    await writeWord("0ISPLAY"); // D => 0

    await writeWord("ON");
    await writeWord("OFF");

    await writeWord("YES");
    await writeWord("NO");

    await writeWord("OPEN");
    await writeWord("CLOSE");

    await writeWord("Hot");
    await writeWord("CoId"); // l => I

    await writeWord("PLAY");
    await writeWord("PAUSE");
    await writeWord("StoP");
    await writeWord("SHUFFLE");

    await writeWord("Error");
    await writeWord("FAIL");
    await writeWord("HELP");

    await writeWord("Good 8YE", false); // B => 8

    await writeWord("     ", false); // finish scrolling
}

async function writeNumbers(ht16k33) {
    let values = [];

    // Test display correct, event with weird values ;-)
    values = [];
    values.push("1:");
    values.push("1..2...3...");
    values.push(":1");
    values.push("1::");
    for (let value of values) {
        await ht16k33.writeData(SEVEN_SEGMENT.displayCharacters(value));
        await smallWait();
    }

    // Move the decimal dot
    values = [];
    values.push("1234");
    values.push("1.234");
    values.push("12.34");
    values.push("12:34");
    values.push("123.4");
    values.push("1234.");
    values.push("8.8.:8.8.");
    values.push(["1", "2", ":", "3", "4"]);
    for (let value of values) {
        await ht16k33.writeData(SEVEN_SEGMENT.displayCharacters(value));
        await smallWait();
    }

    // Sample numbers and time
    values = [];
    values.push("23:19");
    values.push("-678");
    values.push(1234);
    values.push(-888);
    values.push("-2°C");
    values.push("-5°F");
    for (let value of values) {
        await ht16k33.writeData(SEVEN_SEGMENT.displayCharacters(value));
        await smallWait();
    }

    // Count down
    // for (let i = 9999; i > 0; i -= 3) {
    for (let i = 9; i > 0; i -= 1) {
        if (i > 0) {
            await ht16k33.writeData(SEVEN_SEGMENT.displayCharacters(i));
            // await smallWait();
        }
    }
}

async function main() {
    debugger;
    let ht16k33 = await HT16K33.factory();

    await testSegments(ht16k33);
    await testBrightness(ht16k33);
    await testCharacters(ht16k33);
    await writeNumbers(ht16k33);
    await writeWords(ht16k33);

    await ht16k33.clearDisplay();
    console.log("DONE");
}

main();