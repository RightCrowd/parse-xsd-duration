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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parse = function (input) {
        if (typeof input !== 'string') {
            throw new TypeError('expected input to be a string');
        }
        if (!exports.IsValidXsdDuration(input)) {
            return null;
        }
        var isNegative = input[0] === '-';
        var _a = (isNegative ? input.slice(1) : input).split('T'), date = _a[0], time = _a[1];
        var duration = __assign({}, parseDate(date.slice(1)), parseTime(time));
        var totalSeconds = isNegative ? -sum(duration) : sum(duration);
        return __assign({ totalSeconds: totalSeconds, isNegative: isNegative }, duration);
    };
    exports.totalSeconds = function (input) {
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
    exports.default = (function (input, toObject) {
        if (toObject === void 0) { toObject = false; }
        return toObject ? exports.parse(input) : exports.totalSeconds(input);
    });
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
        seconds: 1,
    };
    var sum = function (duration) {
        var total = 0;
        for (var key in duration) {
            total += duration[key] * DateUnits[key];
        }
        return total;
    };
    var parseDate = function (date) {
        var _a = /^(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?$/g.exec(date) || [], _b = _a[1], years = _b === void 0 ? 0 : _b, _c = _a[2], months = _c === void 0 ? 0 : _c, _d = _a[3], days = _d === void 0 ? 0 : _d;
        return { years: getNumber(years), months: getNumber(months), days: getNumber(days) };
    };
    var parseTime = function (time) {
        var _a = /^(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/g.exec(time) || [], _b = _a[1], hours = _b === void 0 ? 0 : _b, _c = _a[2], minutes = _c === void 0 ? 0 : _c, _d = _a[3], seconds = _d === void 0 ? 0 : _d;
        return { hours: getNumber(hours), minutes: getNumber(minutes), seconds: getNumber(seconds) };
    };
    var getNumber = function (amount) {
        var amt = parseFloat(amount.toString());
        if (isNaN(amt))
            return 0;
        return amt;
    };
});
//# sourceMappingURL=index.js.map