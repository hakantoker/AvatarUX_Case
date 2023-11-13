export enum SymbolTexture {
    SYMBOL_9 = "9",
    SYMBOL_10 = "10",
    SYMBOL_J = "J",
    SYMBOL_Q = "Q",
    SYMBOL_K = "K",
    SYMBOL_A = "A",
    SYMBOL_H1 = "H1",
    SYMBOL_H2 = "H2",
}

export const PAY_TABLE: {
    [key: string]: number[];
} = {
    SYMBOL_9: [0, 0, 5, 20, 100],
    SYMBOL_10: [0, 0, 5, 20, 100],
    SYMBOL_J: [0, 0, 10, 40, 200],
    SYMBOL_Q: [0, 0, 10, 40, 200],
    SYMBOL_K: [0, 0, 20, 80, 400],
    SYMBOL_A: [0, 0, 20, 80, 400],
    SYMBOL_H1: [0, 0, 50, 200, 1000],
    SYMBOL_H2: [0, 0, 100, 800, 5000],
};

export const SYMBOL_WEIGHT: {
    [key: string]: number;
} = {
    SYMBOL_9: 8,
    SYMBOL_10: 8,
    SYMBOL_J: 4,
    SYMBOL_Q: 4,
    SYMBOL_K: 3,
    SYMBOL_A: 3,
    SYMBOL_H1: 2,
    SYMBOL_H2: 1,
};

export const REEL_COUNT = 5;
export const SYMBOL_COUNT = 3;
export const SYMBOL_WIDTH = 200;
export const SYMBOL_HEIGHT = 200;
export const REEL_FALL_DURATION = 0.45; // duration of reel fall
export const REEL_FALL_GAP = 0.1; // duration between each reel fall
export const SYMBOL_FALL_GAP = 0.025; // duration between each symbol fall

export const SYMBOL_DROP_HEIGHT = SYMBOL_HEIGHT * SYMBOL_COUNT;

export const SYMBOL_ARRAY: string[] = [];

Object.keys(SYMBOL_WEIGHT).forEach((symbol, index) => {
    const value = SYMBOL_WEIGHT[symbol];
    SYMBOL_ARRAY.push(...Array(value).fill(symbol));
});
