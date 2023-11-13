export type Way = {
    symbol: string;
    length: number;
    reelIndexes: number[];
};

export type SpinResult = {
    ways: Way[];
    totalPay: number;
};
