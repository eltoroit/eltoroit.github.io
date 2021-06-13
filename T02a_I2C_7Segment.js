const rpio = require('rpio');

class HT16K33 {
    ADDRESS = 0x70;
    BRIGHTNESS = 15;
    BAUD_RATE = 100e3; // 100KHz

    constructor() {
        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(this.ADDRESS); // Address this chip
        rpio.i2cSetBaudRate(this.BAUD_RATE); //  I2C protocol clock speeds: Standard-mode 
        rpio.i2cWrite(Buffer.from([(0x20 | 0x01)])); // Turn on the oscillator (Page 10)
        rpio.i2cWrite(Buffer.from([(0x80 | 0x01 | 0x00)])); // Turn display on, and no blinking (Page 11)
        this.setBrightness(this.BRIGHTNESS); // Set display to full brightness (Page 15)

        // Clear RAM
        for (var x = 0; x < 16; x++) {
            rpio.i2cWrite(Buffer.from([x, 0]));
        }
    }

    setBrightness(b) {
        b = Math.min(Math.max(0, b), 15); // [0 ~ 15]
        rpio.i2cWrite(Buffer.from([(0xE0 | b)])); // (Page 15)
    }

    writeData(data) {
        data.forEach((digit, position) => {
            let b = Buffer.from([position << 1, digit]);
            rpio.i2cWrite(b);
        });
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
            H: 0x76,
            E: 0x79,
            L: 0x38,
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

let tmp;
let numbers;
let matrix = new HT16K33();

debugger;
// tmp = SEVEN_SEGMENT.format("1:"); matrix.writeData(tmp); rpio.msleep(1000);
// tmp = SEVEN_SEGMENT.format("1..2...3..."); matrix.writeData(tmp); rpio.msleep(1000);
// tmp = SEVEN_SEGMENT.format(":1"); matrix.writeData(tmp); rpio.msleep(1000);
// tmp = SEVEN_SEGMENT.format("1::"); matrix.writeData(tmp); rpio.msleep(1000);

numbers = "   HELL0 - 0123456789   ";
for (let i = 0; i < numbers.length; i++) {
    if (i > 0) rpio.msleep(250);
    tmp = SEVEN_SEGMENT.format(numbers.substr(i, 4));
    matrix.writeData(tmp);
}

numbers = "abcdefg";
for (let j = 0; j < 2; j++) {
    for (let i = 0; i < 7; i++) {
        if (i > 0) rpio.msleep(250);
        tmp = SEVEN_SEGMENT.format(numbers.substr(i, 1).repeat(4));
        matrix.writeData(tmp);
    }
}

tmp = SEVEN_SEGMENT.format("1"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("12"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("123"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("1234"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("1.234"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("12.34"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("12:34"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("123.4"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("1234."); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("23:19"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("-678"); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format(1234); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format(12.34); matrix.writeData(tmp); rpio.msleep(1000);
// tmp = SEVEN_SEGMENT.format(23:19);
tmp = SEVEN_SEGMENT.format(-888); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format(["1", "2", ":", "3", "4"]); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format("8.8.:8.8."); matrix.writeData(tmp); rpio.msleep(1000);
tmp = SEVEN_SEGMENT.format(""); matrix.writeData(tmp); rpio.msleep(1000);

for (let i = 9999; i > 0; i -= 3) {
    tmp = SEVEN_SEGMENT.format(i);
    if (i > 0) {
        matrix.writeData(tmp);
    }
    // rpio.msleep(1);
}

tmp = SEVEN_SEGMENT.format(""); matrix.writeData(tmp); rpio.msleep(1000);

