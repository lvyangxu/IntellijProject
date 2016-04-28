"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by karl on 2016/4/22.
 */

var math = function () {
  function math() {
    _classCallCheck(this, math);
  }

  _createClass(math, null, [{
    key: "buildRandom",


    /**
     * build a random int from 0 to max
     * @param max
     * @returns {number}
     */
    value: function buildRandom(max) {
      var random = Math.round(Math.random() * max);
      return random;
    }
  }]);

  return math;
}();

//# sourceMappingURL=math.js.map