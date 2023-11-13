export const lerp = function (start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
};

export const cubic = function (t: number, P1: number = -0.2, P2: number = 1.2): number {
    const y0: number = 0;
    const y1: number = P1;
    const y2: number = P2;
    const y3: number = 1;

    const y = (t: number): number =>
        Math.pow(1 - t, 3) * y0 +
        3 * Math.pow(1 - t, 2) * t * y1 +
        3 * (1 - t) * Math.pow(t, 2) * y2 +
        Math.pow(t, 3) * y3;

    return y(t);
};
