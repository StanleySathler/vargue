const format = require('date-fns/format');
const Sqrl = require('squirrelly-fork');

Sqrl.defineFilter('date', date => {
  return format(date, 'dd MMM yyyy');
});
