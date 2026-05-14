"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.RawSidebar = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _generic = require("../utility/generic");

var _TimelineStateContext = require("../timeline/TimelineStateContext");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Sidebar =
/*#__PURE__*/
function (_Component) {
  _inherits(Sidebar, _Component);

  function Sidebar() {
    _classCallCheck(this, Sidebar);

    return _possibleConstructorReturn(this, _getPrototypeOf(Sidebar).apply(this, arguments));
  }

  _createClass(Sidebar, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return !(nextProps.keys === this.props.keys && nextProps.width === this.props.width && nextProps.height === this.props.height && (0, _generic.arraysEqual)(nextProps.groups, this.props.groups) && (0, _generic.arraysEqual)(nextProps.groupHeights, this.props.groupHeights) && nextProps.visibleRowFirst === this.props.visibleRowFirst && nextProps.visibleRowLast === this.props.visibleRowLast);
    }
  }, {
    key: "renderGroupContent",
    value: function renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey) {
      if (this.props.groupRenderer) {
        return _react["default"].createElement(this.props.groupRenderer, {
          group: group,
          isRightSidebar: isRightSidebar
        });
      } else {
        return (0, _generic._get)(group, isRightSidebar ? groupRightTitleKey : groupTitleKey);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          width = _this$props.width,
          groupHeights = _this$props.groupHeights,
          height = _this$props.height,
          isRightSidebar = _this$props.isRightSidebar,
          visibleRowFirst = _this$props.visibleRowFirst,
          visibleRowLast = _this$props.visibleRowLast,
          groupTopsPrefixSum = _this$props.groupTopsPrefixSum;
      var _this$props$keys = this.props.keys,
          groupIdKey = _this$props$keys.groupIdKey,
          groupTitleKey = _this$props$keys.groupTitleKey,
          groupRightTitleKey = _this$props$keys.groupRightTitleKey;
      var sidebarStyle = {
        width: "".concat(width, "px"),
        height: "".concat(height, "px")
      };
      var groupsStyle = {
        width: "".concat(width, "px")
      };
      var total = this.props.groups.length;
      var useVirtualization = visibleRowFirst !== undefined && visibleRowFirst >= 0 && visibleRowLast >= visibleRowFirst && groupTopsPrefixSum && groupTopsPrefixSum.length > 1;
      var first = useVirtualization ? visibleRowFirst : 0;
      var last = useVirtualization ? Math.min(visibleRowLast, total - 1) : total - 1;
      var topSpacer = useVirtualization ? groupTopsPrefixSum[first] || 0 : 0;
      var totalHeightPx = useVirtualization ? groupTopsPrefixSum[total] || 0 : 0;
      var bottomSpacer = useVirtualization ? Math.max(0, totalHeightPx - (groupTopsPrefixSum[last + 1] || 0)) : 0;
      var groupLines = [];

      if (topSpacer > 0) {
        groupLines.push(_react["default"].createElement("div", {
          key: "rct-sidebar-top-spacer",
          style: {
            height: "".concat(topSpacer, "px")
          }
        }));
      }

      for (var i = first; i <= last; i++) {
        var group = this.props.groups[i];
        var elementStyle = {
          height: "".concat(groupHeights[i], "px"),
          lineHeight: "".concat(groupHeights[i], "px")
        };
        groupLines.push(_react["default"].createElement("div", {
          key: (0, _generic._get)(group, groupIdKey),
          className: 'rct-sidebar-row rct-sidebar-row-' + (i % 2 === 0 ? 'even' : 'odd'),
          style: elementStyle
        }, this.renderGroupContent(group, isRightSidebar, groupTitleKey, groupRightTitleKey)));
      }

      if (bottomSpacer > 0) {
        groupLines.push(_react["default"].createElement("div", {
          key: "rct-sidebar-bottom-spacer",
          style: {
            height: "".concat(bottomSpacer, "px")
          }
        }));
      }

      return _react["default"].createElement("div", {
        className: 'rct-sidebar' + (isRightSidebar ? ' rct-sidebar-right' : ''),
        style: sidebarStyle
      }, _react["default"].createElement("div", {
        style: groupsStyle
      }, groupLines));
    }
  }]);

  return Sidebar;
}(_react.Component);

exports.RawSidebar = Sidebar;

_defineProperty(Sidebar, "propTypes", {
  groups: _propTypes["default"].oneOfType([_propTypes["default"].array, _propTypes["default"].object]).isRequired,
  width: _propTypes["default"].number.isRequired,
  height: _propTypes["default"].number.isRequired,
  groupHeights: _propTypes["default"].array.isRequired,
  keys: _propTypes["default"].object.isRequired,
  groupRenderer: _propTypes["default"].func,
  isRightSidebar: _propTypes["default"].bool,
  visibleRowFirst: _propTypes["default"].number,
  visibleRowLast: _propTypes["default"].number,
  groupTopsPrefixSum: _propTypes["default"].array
});

var SidebarWrapper = function SidebarWrapper(props) {
  return _react["default"].createElement(_TimelineStateContext.TimelineStateConsumer, null, function (_ref) {
    var visibleRowFirst = _ref.visibleRowFirst,
        visibleRowLast = _ref.visibleRowLast,
        groupTopsPrefixSum = _ref.groupTopsPrefixSum;
    return _react["default"].createElement(Sidebar, _extends({
      visibleRowFirst: visibleRowFirst,
      visibleRowLast: visibleRowLast,
      groupTopsPrefixSum: groupTopsPrefixSum
    }, props));
  });
};

var _default = SidebarWrapper;
exports["default"] = _default;