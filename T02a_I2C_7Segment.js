const rpio = require('rpio');

class HT16K33 {
    ADDRESS = 0x70;
    BRIGHTNESS = 15;
    BAUD_RATE = 100e3; // 100KHz

    constructor() {
        this.write_buffer = [];
        this.current_array = [];

        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(this.ADDRESS);
        rpio.i2cSetBaudRate(this.BAUD_RATE);

        // Turn on the oscillator
        rpio.i2cWrite(Buffer.from([(0x20 | 0x01)]));

        // Turn display on
        rpio.i2cWrite(Buffer.from([(0x80 | 0x01 | 0x00)]));

        // Initial Clear
        for (var x = 0; x < 16; x++) {
            let tmp = Buffer.from([x, 0]);
            rpio.i2cWrite(tmp);
        }

        // Set display to full brightness
        this.setBrightness(this.BRIGHTNESS);
    }


    setBrightness(b) {
        if (b > 15) b = 15;
        if (b < 0) b = 0;
        rpio.i2cWrite(Buffer.from([(0xE0 | b)]));
    }

    setLED(y, x, value) {
        var led = y * 16 + ((x + 7) % 8);

        var pos = Math.floor(led / 8);
        var offset = led % 8;


        if (value)
            this.write_buffer[pos] |= (1 << offset);
        else
            this.write_buffer[pos] &= ~(1 << offset);
    }

    writeArray(_array) {

        this.current_array = _array;
        this.clearBuffer();

        var x = 0;
        var y = 0;

        for (var i in _array) {
            this.setLED(y, x, _array[i]);

            x++;

            if (x >= 8) {
                y++;
                x = 0;
            }

        }

        this.writeBuffer();
    }

    writeBuffer() {
        for (var i in this.write_buffer) {
            let x = this.write_buffer[i];
            console.log(`i: ${i} => ${x}`);
            let y = Buffer.from([i, x]);
            rpio.i2cWrite(y);
        }
    }

    clearBuffer() {
        for (var i in this.write_buffer) {
            this.write_buffer[i] = 0;
        }
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
        const bitmap = chars.map(this._charToSevenSegment);
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
        } else {
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

let randomBits;
// randomBits = [
//     /*
//     DP A  B  C  D  E  F  G
//     */
//     0, 0, 1, 1, 0, 0, 0, 0, // MSB A
//     0, 1, 1, 0, 1, 1, 0, 1,
//     0, 0, 1, 0, 0, 0, 0, 0, // Dots for hour
//     0, 1, 1, 1, 1, 0, 0, 1,
//     1, 0, 1, 1, 0, 0, 1, 1  // LSB G
// ];

randomBits = [
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 1, 0, 0, 0, 0, 1, 0,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 1, 1, 0, 0, 1,
    0, 1, 0, 0, 0, 0, 1, 0,
    0, 0, 1, 1, 1, 1, 0, 0,
];

let matrix = new HT16K33();
matrix.writeArray(randomBits);

let tmp;
tmp = SEVEN_SEGMENT.format("1234");
debugger;


// tmp = SEVEN_SEGMENT.format("1.234");
// tmp = SEVEN_SEGMENT.format("23:19");
// tmp = SEVEN_SEGMENT.format("-678");
// tmp = SEVEN_SEGMENT.format(1234);
// tmp = SEVEN_SEGMENT.format(1.234);
// // tmp = SEVEN_SEGMENT.format(23:19);
// tmp = SEVEN_SEGMENT.format(-678);
// tmp = SEVEN_SEGMENT.format(["1", "2", "3", "4"]);
