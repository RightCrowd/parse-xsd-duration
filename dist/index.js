"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parse = function (input) { return new XsdDuration(input); };
exports.TotalSeconds = function (input) {
    if (typeof input !== 'string') {
        throw new TypeError('expected input to be a string');
    }
    if (!exports.IsValidXsdDuration(input)) {
        return null;
    }
    var isNegative = input[0] === '-';
    var _a = (isNegative ? input.slice(1) : input).split('T'), date = _a[0], time = _a[1];
    var duration = __assign({}, parseDate(date.slice(1)), parseTime(time));
    return isNegative ? -sum(duration) : sum(duration);
};
var XsdDuration = /** @class */ (function () {
    function XsdDuration(input) {
        this.isNegative = false;
        this.years = 0;
        this.months = 0;
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        if (typeof input !== 'string') {
            throw new TypeError('expected input to be a string');
        }
        this.isNegative = input[0] === '-';
        var _a = (this.isNegative ? input.slice(1) : input).split('T'), date = _a[0], time = _a[1];
        parseDate(date.slice(1), this);
        parseTime(time, this);
    }
    Object.defineProperty(XsdDuration.prototype, "totalSeconds", {
        get: function () {
            return this.isNegative ? -sum(this) : sum(this);
        },
        enumerable: true,
        configurable: true
    });
    XsdDuration.prototype.Sterilize = function () {
        var serialized = (this.isNegative ? '-' : '') + 'P';
        if ([this.days, this.months, this.years].some(function (d) { return d !== 0; })) {
            if (this.years !== 0)
                serialized += this.years + 'Y';
            if (this.months !== 0)
                serialized += this.months + 'M';
            if (this.days !== 0)
                serialized += this.days + 'D';
        }
        if ([this.hours, this.minutes, this.seconds].some(function (d) { return d !== 0; })) {
            if (this.hours !== 0)
                serialized += this.hours + 'H';
            if (this.minutes !== 0)
                serialized += this.minutes + 'M';
            if (this.seconds !== 0)
                serialized += this.seconds + 'S';
        }
        return serialized;
    };
    return XsdDuration;
}());
exports.XsdDuration = XsdDuration;
// Regex taken from https://www.w3.org/TR/xmlschema11-2/#duration-lexical-space
exports.IsValidXsdDuration = function (str) {
    return /^-?P((([0-9]+Y([0-9]+M)?([0-9]+D)?|([0-9]+M)([0-9]+D)?|([0-9]+D))(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S)))?)|(T(([0-9]+H)([0-9]+M)?([0-9]+(\.[0-9]+)?S)?|([0-9]+M)([0-9]+(\.[0-9]+)?S)?|([0-9]+(\.[0-9]+)?S))))$/.test(str);
};
var DateUnits = {
    years: 31536000,
    months: 2628000,
    days: 86400,
    hours: 3600,
    minutes: 60,
    seconds: 1
};
var sum = function (duration) {
    var total = 0;
    for (var key in DateUnits) {
        total += duration[key] * DateUnits[key];
    }
    return total;
};
var parseDate = function (date, out) {
    if (out === void 0) { out = { years: 0, months: 0, days: 0 }; }
    var _a = /^(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?$/g.exec(date) || [], _b = _a[1], years = _b === void 0 ? 0 : _b, _c = _a[2], months = _c === void 0 ? 0 : _c, _d = _a[3], days = _d === void 0 ? 0 : _d;
    out.years = getNumber(years),
        out.months = getNumber(months),
        out.days = getNumber(days);
    return out;
};
var parseTime = function (time, out) {
    if (out === void 0) { out = { hours: 0, minutes: 0, seconds: 0 }; }
    var _a = /^(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/g.exec(time) || [], _b = _a[1], hours = _b === void 0 ? 0 : _b, _c = _a[2], minutes = _c === void 0 ? 0 : _c, _d = _a[3], seconds = _d === void 0 ? 0 : _d;
    out.hours = getNumber(hours),
        out.minutes = getNumber(minutes),
        out.seconds = getNumber(seconds);
    return out;
};
var getNumber = function (amount) {
    var amt = parseFloat(amount.toString());
    if (isNaN(amt))
        return 0;
    return amt;
};
//# sourceMappingURL=index.js.map