'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* globals document, html2canvas */


var _lodash = require('lodash.defaultsdeep');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// import './feedback.scss';

var dom = {
  createNode: function createNode(tag, attrs, html) {
    var node = document.createElement(tag);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(attrs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        node.setAttribute(key, attrs[key]);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    node.innerHTML = html;
    return node;
  }
};

var Feedback = function () {
  function Feedback() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Feedback);

    this.opts = (0, _lodash2.default)(opts, {
      includeBrowserInfo: true,
      includeHtml: true,
      includeUrl: true,
      html2canvas: window.html2canvas,
      onSubmit: console.log
    });

    this.body = document.body;
    this.refs = {};
    this.ssCanvas = null;

    this.clickX = [];
    this.clickY = [];
    this.clickDrag = [];
    this.painting = false;
  }

  _createClass(Feedback, [{
    key: 'setRefs',
    value: function setRefs() {
      this.refs.btn = document.getElementById('feedback-btn');
      this.refs.wrapper = document.getElementById('feedback-wrapper');
      this.refs.form = document.getElementById('feedback-form');
      this.refs.submitBtn = document.getElementById('feedback-submit-btn');

      this.refs.scrBtn = document.getElementById('feedback-scr-btn');
      this.refs.takeScrBtn = document.getElementById('feedback-take-scr-btn');

      this.refs.previewImg = document.getElementById('feedback-preview-img');
      this.refs.closeBtn = document.getElementById('feedback-close-btn');
      this.refs.note = document.getElementById('feedback-note');
      this.refs.canvas = document.getElementById('feedback-canvas');

      this.refs.canvas.height = window.innerHeight;
      this.refs.canvas.width = window.innerWidth;

      this.context = this.refs.canvas.getContext('2d');
    }
  }, {
    key: 'submitData',
    value: function submitData() {
      var data = {};
      data.note = this.refs.note.value;
      if (this.opts.includeBrowserInfo) {
        data.browser = {};
        ['appCodeName', 'appName', 'appVersion', 'cookieEnabled', 'onLine', 'platform', 'userAgent'].forEach(function (key) {
          data.browser[key] = navigator[key];
        });
        data.browser.plugins = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(navigator.plugins)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            var plugin = navigator.plugins[key];
            data.browser.plugins.push(plugin.name);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      if (this.opts.includeUrl) {
        data.url = document.URL;
      }

      if (this.opts.includeHtml) {
        data.html = document.querySelector('html').innerHTML;
      }

      if (this.ssCanvas) {
        data.img = this.ssCanvas.toDataURL();
      }

      this.opts.onSubmit(data);
      this.unmount();
    }
  }, {
    key: 'addHandlers',
    value: function addHandlers() {
      var _this = this;

      this.refs.submitBtn.addEventListener('click', function () {
        _this.submitData();
      });
      this.refs.closeBtn.addEventListener('click', function () {
        _this.unmount();
      });

      this.refs.scrBtn.addEventListener('click', function () {
        _this.painting = true;

        var overlayEl = getElementById('feedback-wrapper');
        overlayEl.style.display = 'inline';

        _this.refs.scrBtn.style.display = 'none';
        _this.refs.takeScrBtn.style.display = 'inline';
      });

      this.refs.takeScrBtn.addEventListener('click', function () {
        _this.screenshot();
        _this.painting = false;

        var overlayEl = getElementById('feedback-wrapper');
        overlayEl.style.display = 'none';

        _this.refs.scrBtn.style.display = 'inline';
        _this.refs.takeScrBtn.style.display = 'none';
      });

      this.refs.canvas.addEventListener('mousedown', function (e) {
        _this.painting = true;
        _this.addClick(e.pageX, e.pageY);

        _this.redraw();
      });

      this.refs.canvas.addEventListener('mousemove', function (e) {
        if (_this.painting) {
          _this.addClick(e.pageX, e.pageY, true);
          _this.redraw();
        }
      });

      ['mouseup', 'mouseleave'].forEach(function (ev) {
        _this.refs.canvas.addEventListener(ev, function () {
          _this.painting = false;
          //this.screenshot();
        });
      });
    }
  }, {
    key: 'redraw',
    value: function redraw() {
      var context = this.context,
          clickX = this.clickX,
          clickY = this.clickY,
          clickDrag = this.clickDrag;

      context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

      context.strokeStyle = "red";
      context.lineJoin = "round";
      context.lineWidth = 5;

      for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
          context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
          context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
      }
    }
  }, {
    key: 'addClick',
    value: function addClick(x, y, dragging) {
      this.clickX.push(x);
      this.clickY.push(y);
      this.clickDrag.push(dragging);
    }
  }, {
    key: 'screenshot',
    value: function screenshot() {
      var _this2 = this;

      if (!this.opts.html2canvas) {
        return;
      }
      this.opts.html2canvas(this.body, {
        onrendered: function onrendered(canvas) {
          _this2.refs.previewImg.setAttribute('src', canvas.toDataURL());
          _this2.ssCanvas = canvas;
        }
      });
    }
  }, {
    key: 'getButton',
    value: function getButton() {
      return '\n      <a data-html2canvas-ignore class="btn btn-default" id="feedback-btn">Feedback</a>\n    ';
    }
  }, {
    key: 'getForm',
    value: function getForm() {
      return '\n     <div id="feedback-form" data-html2canvas-ignore>\n       <div class="panel panel-default">\n        <div class="panel-heading">Submit Feedback\n          <button id="feedback-close-btn" type="button" class="close" aria-label="Close">\n            <span aria-hidden="true">\xD7</span>\n          </button>\n        </div>\n        <div class="panel-body">\n         <div class="thumnbnail"><img id="feedback-preview-img"></div>\n\n         <button id="feedback-scr-btn" type="button">Screenshot Mode</button>\n         <button id="feedback-take-scr-btn" style="display:none" type="button">Take Screenshot</button>\n\n         <form>\n          <div class="form-group">\n            <label for="feedback-note">Comment</label>\n            <textarea id="feedback-note" class="form-control"></textarea>\n          </div>\n          \n          <input id="feedback-submit-btn" type="button" class="btn btn-default" value="Submit" />\n         </form>\n        </div>\n      </div>\n     </div>\n    ';
    }
  }, {
    key: 'getWrapper',
    value: function getWrapper() {
      return '<div>\n      <canvas id="feedback-canvas"></canvas>\n      ' + this.getForm() + '\n    </div>';
    }
  }, {
    key: 'attach',
    value: function attach(el) {
      var _this3 = this;

      el.addEventListener('click', function () {
        _this3.mount();
      });
    }
  }, {
    key: 'showButton',
    value: function showButton() {
      this.body.appendChild(dom.createNode('div', { id: 'feedback-btn-wrapper' }, this.getButton()));
      this.attach(document.getElementById('feedback-btn'));
    }
  }, {
    key: 'mount',
    value: function mount() {
      this.body.appendChild(dom.createNode('div', { id: 'feedback-wrapper' }, this.getWrapper()));

      var overlayEl = getElementById('feedback-wrapper');
      overlayEl.style.display = 'none';

      this.setRefs();
      this.addHandlers();
      // Add small delay to allow UI to settle
      //setTimeout(() => { this.screenshot(); }, 500);
    }
  }, {
    key: 'unmount',
    value: function unmount() {
      this.refs.wrapper.parentNode.removeChild(this.refs.wrapper);
      this.clickX = [];
      this.clickY = [];
      this.clickDrag = [];
    }
  }]);

  return Feedback;
}();

module.exports = Feedback;