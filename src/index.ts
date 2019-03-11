import { TimeDuration } from './index';
export const Parse = (input: string) : XsdDuration => new XsdDuration(input);

export const TotalSeconds = (input: string) : null|number => {
  if (typeof input !== 'string') {
    throw new TypeError('expected input to be a string')
  }

  if (!IsValidXsdDuration(input)) {
    return null;
  }

  const isNegative = input[0] === '-';
  const [date, time] = (isNegative ? input.slice(1) : input).split('T');

  const duration = {...parseDate(date.slice(1)), ...parseTime(time) };

  return isNegative ? -sum(duration) : sum(duration);
}

export class XsdDuration implements Duration {
  isNegative: boolean = false;
  get totalSeconds(): number {
    return this.isNegative ? -sum(this) : sum(this);
  }
  years: number = 0;
  months: number = 0;
  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  public constructor(input: string) {
    if (typeof input !== 'string') {
      throw new TypeError('expected input to be a string')
    }

    this.isNegative = input[0] === '-';

    const [date, time] = (this.isNegative ? input.slice(1) : input).split('T');

    parseDate(date.slice(1), this);

    parseTime(time, this);
  }

  public Sterilize() : string {
    let serialized = (this.isNegative ? '-' : '') + 'P';

    if([this.days, this.months, this.years].some(d => d !== 0)) {
      if (this.years !== 0) serialized += this.years + 'Y';
      if (this.months !== 0) serialized += this.months + 'M';
      if (this.days !== 0) serialized += this.days + 'D';
    }

    if([this.hours, this.minutes, this.seconds].some(d => d !== 0)) {
      if (this.hours !== 0) serialized += this.hours + 'H';
      if (this.minutes !== 0) serialized += this.minutes + 'M';
      if (this.seconds !== 0) serialized += this.seconds + 'S';
    }

    return serialized;
  }

}

// Regex taken from https://www.w3.org/TR/xmlschema11-2/#duration-lexical-space
export const IsValidXsdDuration = (str: string) =>
  /^-?P((([0-9]+Y([0-9]+M)?([0-9]+D)?|([0-9]+M)([0-9]+D)?|([0-9]+D))(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S)))?)|(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S))))$/.test(str);

export interface Duration extends DateDuration, TimeDuration {
  isNegative: boolean,
  totalSeconds: number,
}

type units = dateUnits | timeUnits;

type dateUnits = 'years' | 'months' | 'days';
export type DateDuration = {
  [key in dateUnits]: number
}

type timeUnits = 'hours' | 'minutes' | 'seconds';
export type TimeDuration = {
  [key in timeUnits]: number
}

const DateUnits = <DateDuration & TimeDuration>{
  years: 31536000,
  months: 2628000,
  days: 86400,
  hours: 3600,
  minutes: 60,
  seconds: 1
}

const sum = (duration: DateDuration & TimeDuration) : number => {
  let total = 0;

  for (let key in DateUnits) {
    total += duration[key as units] * DateUnits[key as units];
  }

  return total;
}

const parseDate = (date: string, out: DateDuration = { years : 0, months : 0, days : 0 }) : DateDuration => {
  const [ , years = 0, months = 0, days = 0 ] = /^(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?$/g.exec(date) || [];

  out.years = getNumber(years),
  out.months = getNumber(months),
  out.days = getNumber(days);

  return out;
}

const parseTime = (time: string, out: TimeDuration = { hours : 0, minutes : 0, seconds : 0 }) : TimeDuration => {
  const [ , hours = 0, minutes = 0, seconds = 0] = /^(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/g.exec(time) || [];

  out.hours = getNumber(hours),
  out.minutes = getNumber(minutes),
  out.seconds = getNumber(seconds);

  return out;
}

const getNumber = (amount: string|number) : number => {
  const amt = parseFloat(amount.toString())
  if (isNaN(amt)) return 0
  return amt
}
