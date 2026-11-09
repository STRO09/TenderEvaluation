/**
 * Convert a duration such as `15m`, `2d`, or `1h` into milliseconds.
 *
 * @param {string} value
 * Duration expression.
 *
 * @returns {number}
 * Duration in milliseconds.
 */
export function parseDuration(value : string) : number {

    const match = /^(\d+)(s|m|h|d)$/.exec(value);

    if (!match) {
        throw new Error(`Invalid duration: ${value}`);
    }

    const amount = Number(match[1]);

    const units : Record<string, number> = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };

    return amount * units[match[2]];
}