const i2c = require("i2c-bus");
const pigpio = require("pigpio");
const Gpio = pigpio.Gpio;
const { Utils } = require("./utils");

class HT16K33 {
	i2c_b1 = null;
	ADDRESS = 0x70;
	BRIGHTNESS = 1;

	static async factory() {
		let ht16k33 = new HT16K33();
		ht16k33.i2c_b1 = await i2c.openPromisified(1);
		console.log(`Turn on the oscillator (Page 10)`);
		await ht16k33._writeArray([(0x20 | 0x01)]);
		console.log(`Turn display on, and no blinking (Page 11)`);
		await ht16k33._writeArray([(0x80 | 0x01 | 0x00)]);
		await ht16k33.setBrightness(ht16k33.BRIGHTNESS);
		await ht16k33.clearDisplay();
		return ht16k33;
	}

	async writeData(data) {
		console.log(`Write data: ${data}`);
		let array = [];
		data.forEach((digit, position) => {
			array.push(position * 2, digit);
		});
		await this._writeArray(array);
	}

	async clearDisplay() {
		console.log(`Clear display`);
		let clearRam = [0];
		"0".repeat(16).split("").forEach((digit) => {
			clearRam.push(digit);
		});
		await this._writeArray(clearRam);
	}

	async setBrightness(brightness) {
		this.BRIGHTNESS = Math.min(Math.max(0, brightness), 15); // [0 ~ 15]
		console.log(`Set display to full brightness (Page 15): ${brightness}`);
		await this._writeArray([(0xE0 | this.BRIGHTNESS)]);
	}

	async _writeArray(data) {
		console.log(data.map(byte => byte.toString(16)));
		let buffer = Buffer.from(data);
		await this.i2c_b1.i2cWrite(this.ADDRESS, buffer.length, buffer);
	}
}

class SEVEN_SEGMENT {
	static testSegment(segment, hasDP = false, hasColon = false) {
		let LEDs = null;
		const segments = {
			a: 0x01,
			b: 0x02,
			c: 0x04,
			d: 0x08,
			e: 0x10,
			f: 0x20,
			g: 0x40,
			8: 0x7f
		};

		if (segment in segments) {
			LEDs = segments[segment];
		} else {
			LEDs = 0x00;
		}
		if (hasDP) {
			LEDs = LEDs | 0x80;
		}
		return [LEDs, LEDs, hasColon ? 0x02 : 0, LEDs, LEDs];
	}

	static format(value) {
		let output = "";
		const bitmap = [];
		const stringRep = Array.isArray(value) ? value.join("") : value.toString();
		const chars = stringRep.split("");
		chars.forEach((char, idx, array) => {
			if (char === ".") {
				let previousDigit = bitmap[bitmap.length - 1];
				bitmap[bitmap.length - 1] = previousDigit | (1 << 7); // 0x80
			} else if (char === ":") {
				// Ignore it
			} else {
				bitmap.push(this._charToSevenSegment(char, idx, array));
			}
		});
		output = this._fixBits(bitmap, chars.indexOf(":") !== -1);
		return output;
	}

	static _fixBits(bitmap, hasColon) {
		for (let i = bitmap.length; i < 4; i++) {
			bitmap.unshift(0);
		}
		bitmap.splice(2, 0, hasColon ? 0x02 : 0);
		return bitmap;
	}

	static _charToSevenSegment(char) {
		const segments = {
			0: 0x3f,
			1: 0x06,
			2: 0x5b,
			3: 0x4f,
			4: 0x66,
			5: 0x6d,
			6: 0x7d,
			7: 0x07,
			8: 0x7f,
			9: 0x6f,
			A: 0x77,
			b: 0x7c,
			C: 0x39,
			c: 0x58,
			d: 0x5e,
			E: 0x79,
			F: 0x71,
			G: 0x3d,
			H: 0x76,
			h: 0x74,
			I: 0x30,
			i: 0x10,
			J: 0x0e,
			L: 0x38,
			n: 0x54,
			O: 0x3f,
			o: 0x5c,
			P: 0x73,
			r: 0x50,
			S: 0x6d,
			t: 0x78,
			U: 0x3e,
			u: 0x1c,
			Y: 0x6e,
			_: 0x08,
			'"': 0x22,
			"'": 0x02,
			"[": 0x39,
			"]": 0x0f,
			"=": 0x48,
			"°": 0x63
		};

		if (char in segments) {
			return segments[char];
		} else {
			return 0;
		}
	}
}

async function smallWait() {
	if (!true) {
		await Utils.readFromConsole(`Press [enter] to continue...`);
	} else {
		await Utils.delay(500);
	}
}

async function main() {
	debugger;
	let data = null;
	let ht16k33 = await HT16K33.factory();

	if (true) {
		// Test segments
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
				data = SEVEN_SEGMENT.testSegment(segment, hasDP, hasColon);
				console.log(`[SEGMENT]${hasDP ? "[DP]" : ""}${hasColon ? "COLON" : ""}[${segment}]`);
				ht16k33.writeData(data);
				await smallWait();
			}
		}

		// Test brightness
		data = SEVEN_SEGMENT.testSegment("8", true, true);
		for (let i = -1; i <= 4; i++) {
			let brightness = 5 * i; // [-5 ~ 20], but function should correct to [0 ~ 15]
			console.log(`[BRIGHTNESS][${brightness} => ${ht16k33.BRIGHTNESS}]`);
			ht16k33.setBrightness(brightness);
			await smallWait();
			console.log(`Rewrite data`);
			ht16k33.writeData(data);
			await smallWait();
		}
	}

	// Test characters
	let allCharacters = `   0123456789AbCcdEFGHhIiJLnOoPrStUuY=_'"[]°   `;
	// allCharacters = `   8888   `;
	for (let i = 0; i < allCharacters.length - 3; i++) {
		data = SEVEN_SEGMENT.format(allCharacters.substr(i, 4));
		console.log(`[${allCharacters[i + 3]}]`);
		ht16k33.writeData(data);
		await smallWait();
	}

	await ht16k33.clearDisplay();
	console.log("DONE");

	// let numbers;
	// await Utils.delay(1000);
	// ht16k33.writeData(SEVEN_SEGMENT.format("HELL")); await Utils.delay(1000);
	// ht16k33.writeData(SEVEN_SEGMENT.format("ELL0")); await Utils.delay(1000);
	// ht16k33.clearDisplay(); await Utils.delay(1000);
	// ht16k33.writeData(SEVEN_SEGMENT.format("HELL")); await Utils.delay(1000);
	// ht16k33.writeData(SEVEN_SEGMENT.format("ELL0")); await Utils.delay(1000);
}

main();
// await ht16k33.writeData(SEVEN_SEGMENT.format("1:")); await Utils.delay(1000);
// await ht16k33.writeData(SEVEN_SEGMENT.format("1..2...3...")); await Utils.delay(1000);
// await ht16k33.writeData(SEVEN_SEGMENT.format(":1")); await Utils.delay(1000);
// await ht16k33.writeData(SEVEN_SEGMENT.format("1::")); await Utils.delay(1000);

// numbers = "   HELL0 - 0123456789   ";
// for (let i = 0; i < numbers.length; i++) {
//     if (i > 0) await Utils.delay(250);
//     ht16k33.writeData(SEVEN_SEGMENT.format(numbers.substr(i, 4)));
// }

// numbers = "abcdefgACEFHJLPU0123456789- ";
// for (let j = 0; j < 2; j++) {
//     for (let i = 0; i < numbers.length; i++) {
//         if (i > 0) await Utils.delay(250);
//         let char = numbers.substr(i, 1);
//         ht16k33.writeData(SEVEN_SEGMENT.format(char.repeat(4)));
//     }
// }

// ht16k33.writeData(SEVEN_SEGMENT.format("1")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("12")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("123")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("1234")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("1.234")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("12.34")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("12:34")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("123.4")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("1234.")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("23:19")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("-678")); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format(1234)); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format(12.34)); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format(-888)); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format(["1", "2", ":", "3", "4"])); await Utils.delay(1000);
// ht16k33.writeData(SEVEN_SEGMENT.format("8.8.:8.8.")); await Utils.delay(1000);
// ht16k33.clearDisplay(); await Utils.delay(1000);

// for (let i = 9999; i > 0; i -= 3) {
//     if (i > 0) {
//         ht16k33.writeData(SEVEN_SEGMENT.format(i));
//     }
// }

// ht16k33.clearDisplay();
