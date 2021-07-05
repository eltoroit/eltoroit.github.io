const i2c = require("i2c-bus");

i2c_b1 = null;
ADDRESS = 0x70;

async function writeData(data) {
    await i2c_b1.i2cWrite(ADDRESS, data.length, Buffer.from(data));
}

async function test() {
    i2c_b1 = await i2c.openPromisified(1);

    console.log(`Turning on the oscillator`);
    await i2c_b1.i2cWrite(ADDRESS, 1, Buffer.from([0x21])); // 0x20 | 0x01

    console.log(`Show Colon`);
    await i2c_b1.i2cWrite(ADDRESS, 10, Buffer.from([
        0x00, 0b10000000,
        0x02, 0b10000000,
        0x04, 0b00000010,
        0x06, 0b10000000,
        0x08, 0b10000000
    ]));
}

test();


/*
    // Inspect this with the logic analyzer
    await i2c_b1.i2cWrite(ADDRESS, 10, Buffer.from([
        0x00, 0b10000000,
        0x02, 0b10101010,
        0x04, 0b00000010,
        0x06, 0b00100100,
        0x08, 0b11011011
    ]));
*/