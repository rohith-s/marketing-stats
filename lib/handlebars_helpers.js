"use strict";

/**
 * IMS Collection of Handlebars helpers
 */

const log = require('debug')('marketing-stats:lib:handlebars_helpers'),
    _ = require('underscore');

// =========================
// Initialize Logging ======
// =========================

// Debug by default goes to stderr - change to use stdout
const error_log = log;                          // Console.err == STDERR
log.log = console.log.bind(console);    // don't forget to bind to console!


// =========================
// Initialize Lib ==========
// =========================

return module.exports = function (Handlebars) {
    let _self = {};

    // Makes JSON safe to display in handlebars (JSON.stringify) - overcomes [object object]
    _self.json = function (context) {
        return JSON.stringify(context).replace(/"/g, "'");
    };


    // Allows rendering of elements based on specific comparison {{ifCond projectname 'giveaway'}}
    _self.ifCond = function (value, comparison, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper 'ifCond' needs 2 parameters");
        if (value == comparison) return options.fn(this);
        return options.inverse(this);
    };

    // Opposite of ifCond {{ifNot projectname 'giveaway'}}
    _self.ifNot = function (value, comparison, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper 'ifNot' needs 2 parameters");
        if (value != comparison) return options.fn(this);
        return options.inverse(this);
    };

    // Checks if field is falsey, null, or undefined
    _self.ifValid = function (value, options) {
        if (arguments.length < 2) throw new Error("Handlebars Helper ifValid needs 1 parameter");
        if (!value ||
            _.isEmpty(value) ||
            value === 'null' ||
            value === 'undefined'
        ) return options.inverse(this);

        return options.fn(this);
    };

    // Checks if either of the passed values is true {{#ifOr false true false true}}{{/ifOr}}
    _self.ifOr = function () {
        if (arguments.length < 3) throw new Error("Handlebars Helper ifOr needs 2+ parameters");
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object' && !!arguments[arg])
                return arguments[arguments.length - 1].fn(this);

        }
        return arguments[arguments.length - 1].inverse(this);
    };

    // Checks if BOTH of the passed values are true {{ifOr false true}}
    _self.ifAnd = function (value1, value2, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper ifAnd needs 2 parameters");
        if (!value1 || !value2 ||
            _.isEmpty(value1) || _.isEmpty(value2) ||
            value1 === 'null' || value2 === 'null' ||
            value1 === 'undefined' || value2 === 'undefined'
        ) return options.inverse(this);

        return (value1 && value2) ? options.fn(this) : options.inverse(this);
    };

    _self.ifIn = function (elem, list, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper 'ifIn' needs 2 parameters");
        if (list.indexOf(elem) > -1) return options.fn(this);
        return options.inverse(this);
    };

    _self.ifNotIn = function (elem, list, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper 'ifNotIn' needs 2 parameters");
        list = JSON.parse(list.replace(/'/g, '"'));
        if (list.indexOf(elem) === -1) return options.fn(this);
        return options.inverse(this);
    };

    _self.compare = function (lvalue, rvalue, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper 'compare' needs 2 parameters");

        let operator = options.hash.operator || '==';
        // console.log(operator,lvalue,rvalue);

        let operators = {
            '==': function (l, r) {
                return l == r;
            },
            '===': function (l, r) {
                return l === r;
            },
            '!=': function (l, r) {
                return l != r;
            },
            '<': function (l, r) {
                return l < r;
            },
            '>': function (l, r) {
                return l > r;
            },
            '<=': function (l, r) {
                return l <= r;
            },
            '>=': function (l, r) {
                return l >= r;
            },
            'typeof': function (l, r) {
                return typeof l == r;
            }
        };
        if (!operators[operator]) throw new Error("Handlebars Helper 'compare' doesn't know the operator " + operator);
        if (operators[operator](lvalue, rvalue)) return options.fn(this);
        return options.inverse(this);

    };


    /**
     * Runs comparison between first value, comparison type, and second value
     * @param value            {integer}
     * @param operator        {string}
     * @param comparison    {integer}
     * @param options        {object}    handlebars options
     * @returns            {*}
     */
    _self.ifCompare = function (value, operator, comparison, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper ifCompare needs 3 parameters");
        if (~operator.indexOf('>=') && value >= comparison) return options.fn(this);
        if (~operator.indexOf('>') && value > comparison) return options.fn(this);
        if (~operator.indexOf('<=') && value <= comparison) return options.fn(this);
        if (~operator.indexOf('<') && value < comparison) return options.fn(this);
        if (~operator.indexOf('=') && value == comparison) return options.fn(this);
        if (~operator.indexOf('==') && value == comparison) return options.fn(this);
        if (~operator.indexOf('===') && value === comparison) return options.fn(this);
        return options.inverse(this)
    };

    _self.math = function (lvalue, operator, rvalue) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "//": Math.ceil(lvalue / rvalue),
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    };

    // Checks if value exists - if falsey, uses default value
    _self.ifDefault = function (value, default_val, options) {
        if (arguments.length < 3) throw new Error("Handlebars Helper ifDefault needs 2 parameters");
        return new Handlebars.SafeString(value || default_val);
    };

    _self.concat = function () {
        let outStr = '';
        for (let arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    };

    return _self;

};
