const i2c = require("i2c-bus");

i2c_b1 = null;
ADDRESS = 0x70;
BRIGHTNESS = 5;

async function writeData(data) {
    let buffer = Buffer.from(data);
    await this.i2c_b1.i2cWrite(this.ADDRESS, buffer.length, buffer);
}

function delay(ms) {
    return new Promise((resolve) => { setTimeout(() => { resolve(); }, ms); })
}

async function test() {
    // Open I2C Bus #1
    i2c_b1 = await i2c.openPromisified(1);

    console.log(`Turn on the oscillator (Page 10)`);
    await writeData([(0x20 | 0x01)]);

    console.log(`Turn display on, and no blinking (Page 11)`);
    await writeData([(0x80 | 0x01 | 0x00)]);

    console.log(`Set display's brightness (Page 15)`);
    await writeData([(0xE0 | BRIGHTNESS)]);

    console.log(`Show Colon`);
    await writeData([0x00, 0x00, 0x02, 0x00, 0x04, 0x02, 0x06, 0x00, 0x08, 0x00]);
    await delay(2000);

    console.log(`Show All`);
    await writeData([0x00, 0xFF, 0x02, 0xFF, 0x04, 0x02, 0x06, 0xFF, 0x08, 0xFF]);
    await delay(2000);

    console.log(`Off`);
    await writeData([0x00, 0x00, 0x02, 0x00, 0x04, 0x00, 0x06, 0x00, 0x08, 0x00]);
    await delay(2000);
}

test();