const format = require('date-fns/format');
const br = require('date-fns/locale/pt-BR');
const Sqrl = require('squirrelly-fork');

Sqrl.defineFilter('date', date => {
  return format(date, 'dd MMM yyyy', { locale: br });
});
