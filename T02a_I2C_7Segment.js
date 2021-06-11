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
        data.forEach((digits, position) => {
            digits.unshift(position << 1);
            let b = Buffer.from(digits);
            console.log(b);
            rpio.i2cWrite(b);
        });
    }
}

class SEVEN_SEGMENT {
    static format(numberOrStringOrArray) {
        let tmp = new SEVEN_SEGMENT();
        return tmp._format(numberOrStringOrArray);
    }

    _format(numberOrStringOrArray) {
        const stringRep = Array.isArray(numberOrStringOrArray) ? numberOrStringOrArray.join('') : numberOrStringOrArray.toString();
        const chars = stringRep.split('');
        const bitmap = chars.map(this._charToSevenSegment.bind(this));
        const dotIndicies = chars.map((value, i) => value === '.' ? i : -1).filter(value => value != -1);
        dotIndicies.forEach(value => delete bitmap[value - 1]);
        return this._fixBitmap(bitmap, chars.indexOf(':') === -1);
    }

    _charToSevenSegment(char, i, array) {
        const NUMBERS = [
            0x3F, // 0
            0x06, // 1
            0x5B, // 2
            0x4F, // 3
            0x66, // 4
            0x6D, // 5
            0x7D, // 6
            0x07, // 7
            0x7F, // 8
            0x6F  // 9
        ];

        const MINUS = 0x40;
        if (char === '.') {
            return [this._charToSevenSegment(array[i - 1])[0] | 1 << 7, 0];
        } else if (char === ':') {
            return undefined;
        } else if (char === '-') {
            return [MINUS, 0];
        } else if (char === ' ') {
            return [0, 0];
        } else if (typeof Number(char) === 'number') {
            return [NUMBERS[Number(char)], 0];
        }
    }

    _fixBitmap(bitmap, switchColonOff) {
        let newBitmap = bitmap
            .filter(value => value !== undefined)
            .map(num => num);

        for (var i = newBitmap.length; i < 4; i++) {
            newBitmap.unshift([0, 0]);
        }

        if (switchColonOff) {
            newBitmap.splice(2, 0, [0, 0]);
        } else {
            newBitmap.splice(2, 0, [0x02, 0]);
        }
        return newBitmap;
    }

}

let tmp;
let matrix = new HT16K33();

let numbers = "   0123456789   ";
for (let i = 0; i < numbers.length; i++) {
    if (i > 0) rpio.msleep(100);
    tmp = SEVEN_SEGMENT.format(numbers.substr(i, 4));
    matrix.writeData(tmp);
}



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

