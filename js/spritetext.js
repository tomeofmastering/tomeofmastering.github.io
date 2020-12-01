// Version 1.2.1 three-spritetext - https://github.com/vasturiano/three-spritetext
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('three')) :
  typeof define === 'function' && define.amd ? define(['three'], factory) :
  (global = global || self, global.SpriteText = factory(global.THREE));
}(this, (function (three$1) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var three = window.THREE ? window.THREE // Prefer consumption from global THREE, if exists
  : {
    LinearFilter: three$1.LinearFilter,
    Sprite: three$1.Sprite,
    SpriteMaterial: three$1.SpriteMaterial,
    Texture: three$1.Texture
  };

  var _default =
  /*#__PURE__*/
  function (_three$Sprite) {
    _inherits(_default, _three$Sprite);

    function _default() {
      var _this;

      var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var textHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgba(255, 255, 255, 1)';

      _classCallCheck(this, _default);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(_default).call(this, new three.SpriteMaterial({
        map: new three.Texture(),
		onBeforeCompile: function ( shader ) {
			shader.vertexShader = shader.vertexShader.replace(
				'uniform vec2 center;',
				[
					'uniform vec2 center;',
					'varying float distance;'
				].join('\n')
			);
			shader.vertexShader = shader.vertexShader.replace(
				'mvPosition.xy += rotatedPosition;',
				[
					'mvPosition.xy += rotatedPosition;',
					'distance = length(cameraPosition - mvPosition.xyz);',
					'distance = 1.0 - clamp(distance / 1000.0, 0.0, 1.0);'
				].join('\n')
			);

			shader.fragmentShader = shader.fragmentShader.replace(
				'uniform float opacity;',
				[
					'uniform float opacity;',
					'varying float distance;'
				].join('\n')
			);
			shader.fragmentShader = shader.fragmentShader.replace(
				'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
				'gl_FragColor = vec4( outgoingLight, diffuseColor.a * distance);'
			);
		}
      })));
      _this._text = text;
      _this._textHeight = textHeight;
      _this._color = color;
      _this._fontFace = 'Arial';
      _this._fontSize = 90; // defines text resolution

      _this._fontWeight = 'normal';
      _this._canvas = document.createElement('canvas');
      _this._texture = _this.material.map;
      _this._texture.minFilter = three.LinearFilter;

      _this._genCanvas();

      return _this;
    }

    _createClass(_default, [{
      key: "_genCanvas",
      value: function _genCanvas() {
        var _this2 = this;

        var canvas = this._canvas;
        var ctx = canvas.getContext('2d');

        var lines = this._text.split('\n');

        var font = "".concat(this.fontWeight, " ").concat(this.fontSize, "px ").concat(this.fontFace);
        ctx.font = font; // measure canvas with appropriate font

        canvas.width = Math.max.apply(Math, _toConsumableArray(lines.map(function (line) {
          return ctx.measureText(line).width;
        })));
        canvas.height = this.fontSize * lines.length; // Set font again after canvas is resized, as context properties are reset

        ctx.font = font;
        ctx.fillStyle = this.color;
        ctx.textBaseline = 'bottom';
        lines.forEach(function (line, index) {
          return ctx.fillText(line, (canvas.width - ctx.measureText(line).width) / 2, (index + 1) * _this2.fontSize);
        }); // Inject canvas into sprite

        this._texture.image = canvas;
        this._texture.needsUpdate = true;
        var yScale = this.textHeight * lines.length;
        this.scale.set(yScale * canvas.width / canvas.height, yScale);
      }
    }, {
      key: "clone",
      value: function clone() {
        return new this.constructor(this.text, this.textHeight, this.color).copy(this);
      }
    }, {
      key: "copy",
      value: function copy(source) {
        three.Sprite.prototype.copy.call(this, source);
        this.color = source.color;
        this.fontFace = source.fontFace;
        this.fontSize = source.fontSize;
        this.fontWeight = source.fontWeight;
        return this;
      }
    }, {
      key: "text",
      get: function get() {
        return this._text;
      },
      set: function set(text) {
        this._text = text;

        this._genCanvas();
      }
    }, {
      key: "textHeight",
      get: function get() {
        return this._textHeight;
      },
      set: function set(textHeight) {
        this._textHeight = textHeight;

        this._genCanvas();
      }
    }, {
      key: "color",
      get: function get() {
        return this._color;
      },
      set: function set(color) {
        this._color = color;

        this._genCanvas();
      }
    }, {
      key: "fontFace",
      get: function get() {
        return this._fontFace;
      },
      set: function set(fontFace) {
        this._fontFace = fontFace;

        this._genCanvas();
      }
    }, {
      key: "fontSize",
      get: function get() {
        return this._fontSize;
      },
      set: function set(fontSize) {
        this._fontSize = fontSize;

        this._genCanvas();
      }
    }, {
      key: "fontWeight",
      get: function get() {
        return this._fontWeight;
      },
      set: function set(fontWeight) {
        this._fontWeight = fontWeight;

        this._genCanvas();
      }
    }]);

    return _default;
  }(three.Sprite);

  return _default;

})));
//# sourceMappingURL=three-spritetext.js.map