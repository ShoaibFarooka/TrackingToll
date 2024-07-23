const handlebars = require('handlebars');

handlebars.registerHelper('ifeq', function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this);
});

handlebars.registerHelper('mul', function (a, b) {
    return a * b;
});

handlebars.registerHelper('mergeArr', function (a) {
    return a.join(', ');
});
