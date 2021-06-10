const rpio = require('rpio');

class HT16K33 {
    ADDRESS = 0x70;
    BAUD_RATE = 10e3;

    constructor() {
        this.brightness = 15;
        this.write_buffer = [];
        this.current_array = [];

        rpio.i2cBegin();
        rpio.i2cSetSlaveAddress(this.ADDRESS);
        rpio.i2cSetBaudRate(this.BAUD_RATE);

        // Turn on the oscillator
        rpio.i2cWrite(Buffer.from([(0x20 | 0x01)]));

        // Turn display on
        rpio.i2cWrite(Buffer.from([(0x01 | 0x80)]));

        // Initial Clear
        for (var x = 0; x < 16; x++) {
            rpio.i2cWrite(Buffer.from([x, 0]));
        }

        // Set display to full brightness.
        rpio.i2cWrite(Buffer.from([(0xE0 | this.brightness)]));
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

    writeAnimation(_array, speed) {
        var self = this;
        var old_buffer = this.write_buffer.slice();

        for (var i in _array) {
            self.writeAnimation2(i, _array[i], speed);
        }

        setTimeout(function () {

            self.clearBuffer();
            self.writeBuffer();

        }, _array.length * speed + speed);

        setTimeout(function () {

            self.write_buffer = old_buffer.slice();
            self.writeBuffer();

        }, _array.length * speed + 1000);
    }

    writeAnimation2(i, data, speed) {
        var self = this;

        setTimeout(function () {
            self.writeArray(data);
        }, speed * i);
    }

    writeBuffer() {
        for (var i in this.write_buffer) {
            rpio.i2cWrite(Buffer.from([i, this.write_buffer[i]]));
        }
    }

    clearBuffer() {
        for (var i in this.write_buffer) {
            this.write_buffer[i] = 0;
        }
    }
}

let matrix = new HT16K33();
matrix.writeArray([
    0, 0, 1, 1, 1, 1, 0, 0,
    0, 1, 0, 0, 0, 0, 1, 0,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 1, 1, 0, 0, 1,
    0, 1, 0, 0, 0, 0, 1, 0,
    0, 0, 1, 1, 1, 1, 0, 0,
]);