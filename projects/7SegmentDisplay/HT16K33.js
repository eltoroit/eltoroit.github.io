const i2c = require("i2c-bus");
const pigpio = require("pigpio");
const Gpio = pigpio.Gpio;

const factory = async () => {
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

class HT16K33 {
    i2c_b1 = null;
    ADDRESS = 0x70;
    BRIGHTNESS = 1;

    async writeData(data) {
        // console.log(`Write data: ${data}`);
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
        console.log(`Set display's brightness (Page 15): [${brightness} => ${this.BRIGHTNESS}]`);
        await this._writeArray([(0xE0 | this.BRIGHTNESS)]);
    }

    async _writeArray(data) {
        // console.log(`${data.map(byte => byte.toString(16))}`);
        let buffer = Buffer.from(data);
        await this.i2c_b1.i2cWrite(this.ADDRESS, buffer.length, buffer);
    }
}

exports.factory = factory;
exports.HT16K33 = HT16K33;
