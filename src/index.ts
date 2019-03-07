export const parse = (input: string) : null|Duration => {
  if (typeof input !== 'string') {
    throw new TypeError('expected input to be a string')
  }

  if (!IsValidXsdDuration(input)) {
    return null;
  }

  const isNegative = input[0] === '-';
  const [date, time] = (isNegative ? input.slice(1) : input).split('T');

  const duration = {...parseDate(date.slice(1)), ...parseTime(time) };

  const totalSeconds = isNegative ? -sum(duration) : sum(duration)

  return { totalSeconds, isNegative, ...duration };
}

export const totalSeconds = (input: string) : null|number => {
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

export default (input: string, toObject: boolean = false) => toObject ? parse(input) : totalSeconds(input);

// Regex taken from https://www.w3.org/TR/xmlschema11-2/#duration-lexical-space
export const IsValidXsdDuration = (str: string) =>
  /^-?P((([0-9]+Y([0-9]+M)?([0-9]+D)?|([0-9]+M)([0-9]+D)?|([0-9]+D))(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S)))?)|(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S))))$/.test(
    str
  );

export interface Duration extends DateDuration, TimeDuration {
  isNegative: boolean,
  totalSeconds: number,
}

export interface DateDuration {
  years: number,
  months: number,
  days: number,
}

export interface TimeDuration {
  hours: number,
  minutes: number,
  seconds: number,
}

interface duration extends DateDuration, TimeDuration {
  [index: string] : number;
}

const DateUnits = <duration>{
  years: 31536000,
  months: 2628000,
  days: 86400,
  hours: 3600,
  minutes: 60,
  seconds: 1,
}

const sum = (duration: duration) : number => {
  let total = 0;

  for (let key in duration) {
    total += duration[key] * DateUnits[key];
  }

  return total;
}

const parseDate = (date: string) : { years: number, months : number, days : number } => {
  const [ , years = 0, months = 0, days = 0 ] = /^(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?$/g.exec(date) || [];

  return { years: getNumber(years), months: getNumber(months), days: getNumber(days) };
}

const parseTime = (time: string) : { hours: number, minutes : number, seconds : number } => {
  const [ , hours = 0, minutes = 0, seconds = 0] = /^(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/g.exec(time) || [];

  return { hours: getNumber(hours), minutes: getNumber(minutes), seconds: getNumber(seconds) };
}

const getNumber = (amount: string|number) : number => {
  const amt = parseFloat(amount.toString())
  if (isNaN(amt)) return 0
  return amt
}
