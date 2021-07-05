const segments = {
    a: 0x01,
    b: 0x02,
    c: 0x04,
    d: 0x08,
    e: 0x10,
    f: 0x20,
    g: 0x40,
    8: 0x7f // All segments
};

const characters = {
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
    N: 0x37,
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
    ' ': 0x00,
    '"': 0x22,
    "'": 0x02,
    "[": 0x39,
    "]": 0x0f,
    "=": 0x48,
    "-": 0x40,
    "°": 0x63
};

exports.SEVEN_SEGMENT = class {
    static displaySegment(segment, hasDP = false, hasColon = false) {
        let LEDs = null;

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

    static displayCharacters(value) {
        console.log(`[${value}]`);
        const bitmap = [];
        const chars = (Array.isArray(value) ? value.join("") : value.toString()).split("");
        chars.forEach((char, idx, array) => {
            if (char === ".") {
                let previousDigit = bitmap[bitmap.length - 1];
                bitmap[bitmap.length - 1] = previousDigit | (1 << 7); // 0x80
            } else if (char === ":") {
                // Ignore it
            } else {
                if (char in characters) {
                    bitmap.push(characters[char]);;
                } else {
                    throw new Error(`Could not find letter! [${char}]`);
                }
            }
        });
        for (let i = bitmap.length; i < 4; i++) {
            bitmap.unshift(0);
        }
        bitmap.splice(2, 0, (chars.indexOf(":") !== -1) ? 0x02 : 0x00);
        return bitmap;
    }
}