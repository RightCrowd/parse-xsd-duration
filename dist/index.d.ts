export declare const parse: (input: string) => Duration | null;
export declare const totalSeconds: (input: string) => number | null;
declare const _default: (input: string, toObject?: boolean) => number | Duration | null;
export default _default;
export declare const IsValidXsdDuration: (str: string) => boolean;
export interface Duration extends DateDuration, TimeDuration {
    isNegative: boolean;
    totalSeconds: number;
}
export interface DateDuration {
    years: number;
    months: number;
    days: number;
}
export interface TimeDuration {
    hours: number;
    minutes: number;
    seconds: number;
}
//# sourceMappingURL=index.d.ts.map