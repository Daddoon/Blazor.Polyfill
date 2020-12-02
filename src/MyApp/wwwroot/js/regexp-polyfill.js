(function(global) {
  var NativeRegExp = global.RegExp;

  if (!('flags' in NativeRegExp.prototype)) {
    Object.defineProperty(NativeRegExp.prototype, 'flags', {
      configurable: true,
      get: function() {
        return this.toString().match(/[gimuy]*$/)[0];
      }
    });
  }

  if (!('sticky' in NativeRegExp.prototype)) {
    Object.defineProperty(NativeRegExp.prototype, 'sticky', {
      configurable: true,
      get: function() {
        return false;
      }
    });
  }

  if (!('unicode' in NativeRegExp.prototype)) {
    Object.defineProperty(NativeRegExp.prototype, 'unicode', {
      configurable: true,
      get: function() {
        return false;
      }
    });
  }


  try {
    NativeRegExp('(?<test>a)');
  } catch (error) {

    // https://github.com/commenthol/named-regexp-groups/blob/master/src/index.js
    // https://github.com/slevithan/xregexp/blob/master/src/xregexp.js
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/RegExp
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String
    var R_NAME = /([a-zA-Z_$][a-zA-Z_$0-9]{0,50})/;
    var R_NAME_REPLACE = new NativeRegExp('\\$<' + R_NAME.source + '>', 'g');
    var R_NAMED_BACKREF = new NativeRegExp('^[?:]&' + R_NAME.source);
    var R_GROUP = new NativeRegExp('^[?:]<' + R_NAME.source + '>([^]*)');
    var R_GROUPS = /([\\]?[()])/g;
    var R_EMPTY_GROUPS = /([^\\]|^)\(\)/g;

    function generate(input, flags) {
      var pattern;

      if (input instanceof NativeRegExp) {
        if (flags === void 0) {
          flags = input.flags;
        }
        pattern = input.source;
      } else {
        pattern = String(input);
      }

      var output = {
        groups: {},
        named: {},
        flags: (flags === void 0) ? '' : String(flags),
        source: '',
        originalSource: pattern
      };

      var store = {
        count: 0,     // counter for unnamed matching group
        groups: [''], // store for named pattern
        names: []     // store for names of capture groups
      };

      var index = 0;
      var groups = pattern.split(R_GROUPS);
      output.source = groups.map(function(part, i) {
        var name;
        var block;
        var isGroup = false;

        switch (part) {
          case '(':
            store.groups.push('');
            store.names.push('');
            break;
          case ')':
            block = store.groups.pop();
            name = store.names.pop();
            if (name) {
              output.named[name] = block.substr(1);
            }
            break;
          default:
            // is it a real group, not a cluster (?:...), or assertion (?=...), (?!...)
            isGroup = groups[i - 1] === '(' && !/^\?[:!=]/.test(part);

            if (isGroup) {
              index++;
              // named capture group check
              name = R_GROUP.exec(part);
              if (name && name[1]) {
                if (!output.groups[name[1]]) {
                  store.names[store.names.length - 1] = name[1];
                  output.groups[name[1]] = index;
                } else {
                  output.groups[store.count++] = index;
                }
                part = name[2] || '';
                if (groups[i + 1] === ')' && !name[2]) {
                  part = '[^]+';
                }
              } else {
                // is not a cluster, assertion or named capture group
                output.groups[store.count++] = index;
              }
              // named backreference check
              name = R_NAMED_BACKREF.exec(part);
              if (name && name[1]) {
                part = output.named[name[1]] || '';
              }
            }
            break;
        }

        store.groups = store.groups.map(function(group) {
          return (group + part);
        });

        return part;
      })
        .join('')
        .replace(R_EMPTY_GROUPS, '$1'); // remove any empty groups

      // console.log(output);
      return output;
    }

    var RegExp = function(pattern, flags) {
      if(this instanceof RegExp) {
        var data = generate(pattern, flags);
        var regexp = new NativeRegExp(data.source, data.flags);
        Object.defineProperty(this, '_regexp', { value: regexp });
        Object.defineProperty(this, '_data', { value: data });
      } else {
        return new RegExp(pattern, flags);
      }
    };

    RegExp.toString = function() {
      return 'function RegExp() { [polyfilled code] }';
    }
    RegExp.prototype = {};

    ['global', 'ignoreCase', 'multiline', 'sticky', 'unicode'].forEach(function(propertyName) {
      Object.defineProperty(RegExp.prototype, propertyName, {
        enumerable: true,
        get: function() {
          return this._regexp[propertyName];
        }
      });
    });

    Object.defineProperty(RegExp.prototype, 'lastIndex', {
      enumerable: true,
      get: function() {
        return this._regexp.lastIndex;
      },
      set: function(value) {
        this._regexp.lastIndex = value;
      }
    });

    Object.defineProperty(RegExp.prototype, 'flags', {
      enumerable: true,
      get: function() {
        return this._data.flags;
      }
    });

    Object.defineProperty(RegExp.prototype, 'source', {
      enumerable: true,
      get: function() {
        return this._data.originalSource;
      }
    });


    RegExp.prototype.toString = function() {
      return '/' + this.source + '/' + this.flags;
    };

    RegExp.prototype.exec = function(input) {
      var match = this._regexp.exec(input);
      if (match) {
        match.groups = {};
        var groups = this._data.groups;
        Object.keys(groups).forEach(function(name) {
          match.groups[name] = match[groups[name]];
        });
      }
      return match;
    };

    RegExp.prototype.test = function(input) {
      return this._regexp.test(input);
    };

    RegExp.prototype.constructor = NativeRegExp;

    global.RegExp = RegExp;


    var replace = String.prototype.replace;
    String.prototype.replace = function(regexp, replacement) {
      if (regexp instanceof RegExp) {
        var convertedReplacement;
        switch (typeof replacement) {
          case 'string':
            convertedReplacement = replace.call(replacement, R_NAME_REPLACE, function(match, name) {
              return (name in regexp._data.groups) ? ('$' + regexp._data.groups[name]) : '';
            });
            break;
          case 'function':
            convertedReplacement = replacement.bind(regexp);
            break;
          default:
            return String(replacement);
        }
        return replace.call(this, regexp._regexp, convertedReplacement);
      } else {
        return replace.call(this, regexp, replacement);
      }
    };

    var match = String.prototype.match;
    String.prototype.match = function(regexp) {
      if (regexp instanceof RegExp) {
        return regexp.exec(this);
      } else if (regexp instanceof NativeRegExp) {
        return match.call(this, regexp);
      } else {
        return this.match(new RegExp(regexp));
      }
    };

    var split = String.prototype.split;
    String.prototype.split = function(regexp, maxQuantity) {
      if (regexp instanceof RegExp) {
        return split.call(this, regexp._regexp, maxQuantity);
      } else {
        return split.call(this, regexp, maxQuantity);
      }
    };

    var search = String.prototype.search;
    String.prototype.search = function(regexp) {
      if (regexp instanceof RegExp) {
        return search.call(this, regexp._regexp);
      } else {
        return search.call(this, regexp);
      }
    };

  }
})(
  (typeof global !== 'undefined') ? global
    : ((typeof window !== 'undefined') ? window
    : ((typeof self !== 'undefined') ? self : this))
);
