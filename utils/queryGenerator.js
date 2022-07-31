const create = function (table, data) {
  let _var,
    _value,
    str = '';

  for (var key in data) {
    _var = _var + ',' + key;
    _value = _value + ',' + "'" + data[key] + "'";
  }

  if (_var && _value) {
    return (str =
      'INSERT INTO ' +
      table +
      '(' +
      _var.replace('undefined,', '') +
      ') VALUES (' +
      _value.replace('undefined,', '') +
      ');');
  }
};

const find = function (table, condition = '', order = '', _select = '*') {
  let _condition, str;
  if (condition) {
    _condition = ' WHERE ' + condition;
  }
  str = 'select ' + _select + ' from ' + table + _condition + order;

  if (str) {
    return str;
  } else {
    return null;
  }
};

const findOne = function (table, condition = '', _select = '*') {
  let _condition, str;
  if (condition) {
    _condition = ' WHERE ' + condition;
  }
  str = 'select ' + _select + ' from ' + table + _condition + ' LIMIT 1';

  if (str) {
    return str;
  } else {
    return null;
  }
};

const update = function (table, data = '', condition = '') {
  console.log(data);

  let fields, str;

  for (var key in data) {
    fields = fields + ',' + key + "='" + data[key] + "'";
  }

  str =
    'UPDATE ' +
    table +
    ' SET ' +
    fields.replace('undefined,', '') +
    ' WHERE ' +
    condition;

  if (fields) {
    return str;
  }
};

const remove = function (table, condition = '') {
  //
};
module.exports = { create, find, findOne, update, remove };
