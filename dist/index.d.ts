import { TimeDuration } from './index';
export declare const Parse: (input: string) => XsdDuration;
export declare const TotalSeconds: (input: string) => number | null;
export declare class XsdDuration implements Duration {
    isNegative: boolean;
    readonly totalSeconds: number;
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    constructor(input: string);
    Sterilize(): string;
}
export declare const IsValidXsdDuration: (str: string) => boolean;
export interface Duration extends DateDuration, TimeDuration {
    isNegative: boolean;
    totalSeconds: number;
}
declare type dateUnits = 'years' | 'months' | 'days';
export declare type DateDuration = {
    [key in dateUnits]: number;
};
declare type timeUnits = 'hours' | 'minutes' | 'seconds';
export declare type TimeDuration = {
    [key in timeUnits]: number;
};
export {};
//# sourceMappingURL=index.d.ts.map