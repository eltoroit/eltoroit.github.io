const i2c = require('i2c-bus');
const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;
const { Pins } = require('./pins');

class HT16K33 {
    i2c_b1 = null;
    initialized = false;
    ADDRESS = 0x70;
    BRIGHTNESS = 15;
    BAUD_RATE = 100e3; // 100KHz

    constructor(callback) {
        debugger;
        i2c.openPromisified(1)
            .then(i2c_b1 => this.i2c_b1 = i2c_b1)
            .then(this.initialize.bind(this))
            .then(callback)
            .catch(error => { throw new Error(error) })
    }

    async initialize() {
        debugger;
        // rpio.i2cSetBaudRate(this.BAUD_RATE);  I2C protocol clock speeds: Standard-mode 
        this.i2c_b1.i2cWrite(this.ADDRESS, Buffer.from([(0x20 | 0x01)])); // Turn on the oscillator (Page 10)
        this.i2c_b1.i2cWrite(this.ADDRESS, Buffer.from([(0x80 | 0x01 | 0x00)])); // Turn display on, and no blinking (Page 11)
        // this.setBrightness(this.BRIGHTNESS); // Set display to full brightness (Page 15)
        brightness = Math.min(Math.max(0, brightness), 15); // [0 ~ 15]
        this.i2c_b1.i2cWrite(this.ADDRESS, Buffer.from([(0xE0 | brightness)])); // (Page 15)
        // Clear RAM
        for (var x = 0; x < 16; x++) {
            this.i2c_b1.i2cWrite(this.ADDRESS, Buffer.from([x, 0]));
        }
        this.initialized = true;
    }

    async writeData(data) {
        if (this.initialized) {
            debugger;
            data.forEach((digit, position) => {
                let b = Buffer.from([position << 1, digit]);
                rpio.i2cWrite(this.ADDRESS, b);
            });
        }
    }

    _writeArray(array) {
        let buffer = Buffer.from(array);
        this.i2c_b1.i2cWrite(this.ADDRESS, buffer, array.length);
    }
}

class SEVEN_SEGMENT {
    static format(value) {
        let tmp = new SEVEN_SEGMENT();
        return tmp._format(value);
    }

    _format(value) {
        const bitmap = [];
        const stringRep = Array.isArray(value) ? value.join('') : value.toString();
        const chars = stringRep.split('');
        chars.forEach((char, idx, array) => {
            if (char === '.') {
                let previousDigit = bitmap[bitmap.length - 1];
                bitmap[bitmap.length - 1] = previousDigit | (1 << 7);
            } else if (char === ':') {
                // Ignore it
            } else {
                bitmap.push(this._charToSevenSegment(char, idx, array));
            }
        });
        return this._fixBits(bitmap, chars.indexOf(':') !== -1);
    }

    _charToSevenSegment(char, i, array) {
        const segments = {
            a: 0x01,
            b: 0x02,
            c: 0x04,
            d: 0x08,
            e: 0x10,
            f: 0x20,
            g: 0x40,
            A: 0x77,
            C: 0x39,
            E: 0x79,
            F: 0x71,
            H: 0x76,
            J: 0x0E,
            L: 0x38,
            P: 0x73,
            U: 0x3E,
            0: 0x3F,
            1: 0x06,
            2: 0x5B,
            3: 0x4F,
            4: 0x66,
            5: 0x6D,
            6: 0x7D,
            7: 0x07,
            8: 0x7F,
            9: 0x6F,
            "-": 0x40,
            " ": 0x00
        }

        if (char in segments) {
            return segments[char];
        } else {
            return 0;
        }
    }

    _fixBits(bitmap, hasColon) {
        for (let i = bitmap.length; i < 4; i++) {
            bitmap.unshift(0);
        }
        bitmap.splice(2, 0, hasColon ? 0x02 : 0);
        return bitmap;
    }
}

async function main() {
    let numbers;
    let ht16k33 = new HT16K33(async () => {
        debugger;
        // await ht16k33.writeData(SEVEN_SEGMENT.format("1:")); await pins.delay(1000);
        // await ht16k33.writeData(SEVEN_SEGMENT.format("1..2...3...")); await pins.delay(1000);
        // await ht16k33.writeData(SEVEN_SEGMENT.format(":1")); await pins.delay(1000);
        // await ht16k33.writeData(SEVEN_SEGMENT.format("1::")); await pins.delay(1000);

        numbers = "   HELL0 - 0123456789   ";
        for (let i = 0; i < numbers.length; i++) {
            if (i > 0) await pins.delay(250);
            ht16k33.writeData(SEVEN_SEGMENT.format(numbers.substr(i, 4)));
        }

        numbers = "abcdefgACEFHJLPU0123456789- ";
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < numbers.length; i++) {
                if (i > 0) await pins.delay(250);
                let char = numbers.substr(i, 1);
                ht16k33.writeData(SEVEN_SEGMENT.format(char.repeat(4)));
            }
        }

        ht16k33.writeData(SEVEN_SEGMENT.format("1")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("12")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("123")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("1234")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("1.234")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("12.34")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("12:34")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("123.4")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("1234.")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("23:19")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("-678")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format(1234)); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format(12.34)); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format(-888)); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format(["1", "2", ":", "3", "4"])); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("8.8.:8.8.")); await pins.delay(1000);
        ht16k33.writeData(SEVEN_SEGMENT.format("")); await pins.delay(1000);

        for (let i = 9999; i > 0; i -= 3) {
            if (i > 0) {
                ht16k33.writeData(SEVEN_SEGMENT.format(i));
            }
        }

        ht16k33.writeData(SEVEN_SEGMENT.format("")); await pins.delay(1000);
    });



}

main();