/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./styles/styles.css":
/*!*****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles/styles.css ***!
  \*****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/noSourceMaps.js */ \"./node_modules/css-loader/dist/runtime/noSourceMaps.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ \"./node_modules/css-loader/dist/runtime/api.js\");\n/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);\n// Imports\n\n\nvar ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));\n// Module\n___CSS_LOADER_EXPORT___.push([module.id, `body,\nhtml {\n  margin: 0;\n  padding: 0;\n  height: 100%;\n  width: 100%;\n}\n\n#canvas-container {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\ncanvas {\n  display: block;\n  width: 100%;\n  height: 100%;\n  background-color: #ffffff;\n}\n\n.hud {\n  position: fixed;\n  bottom: 60px;\n  left: 20px;\n  top: auto;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  font-family: monospace;\n  z-index: 2;\n}\n\n.mode-buttons {\n  display: flex;\n  gap: 6px;\n}\n\n.mode-btn {\n  padding: 6px 16px;\n  font-family: monospace;\n  font-size: 14px;\n  font-weight: bold;\n  cursor: pointer;\n  border: 1px solid #555;\n  background-color: #ffffff;\n  color: #000;\n  border-radius: 4px;\n}\n\n.mode-btn.active {\n  background-color: #2e5f2e;\n  color: #ffffff;\n  border-color: #2e5f2e;\n}\n\n.gen-display {\n  color: #ffffff;\n  background-color: rgba(0, 0, 0, 0.6);\n  padding: 6px 10px;\n  border-radius: 4px;\n  font-size: 14px;\n}\n\n.advance-control {\n  display: flex;\n  gap: 6px;\n  align-items: center;\n}\n\n.advance-control input {\n  width: 90px;\n  padding: 6px;\n  font-family: monospace;\n  font-size: 14px;\n  border: 1px solid #555;\n  border-radius: 4px;\n}\n\n.advance-control button {\n  padding: 6px 12px;\n  font-family: monospace;\n  font-size: 14px;\n  font-weight: bold;\n  cursor: pointer;\n  border: 1px solid #555;\n  background-color: #ffffff;\n  color: #000;\n  border-radius: 4px;\n}\n\n.fps-stats {\n  white-space: pre;\n  display: flex;\n  font-family: monospace;\n  color: #ffffff;\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  width: 300px;\n  height: 100px;\n  margin-bottom: 10px;\n  margin-right: 10px;\n  /* background-color: #ddd; */\n  /* text-align: center; */\n  align-items: center;\n  justify-items: center;\n}\n\n#mode-indicator {\n  position: fixed;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  bottom: 0;\n  left: 0;\n  width: 100px;\n  height: 30px;\n  margin-bottom: 10px;\n  margin-right: 10px;\n  color: #ffffff;\n  font-size: 15px;\n  font-family: monospace;\n  font-weight: bold;\n  text-align: center;\n  padding-top: auto;\n  padding-bottom: auto;\n}\n.tooltip {\n  position: fixed;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 20px;\n  height: 20px;\n  margin-top: 20px;\n  margin-left: 20px;\n  top: 0;\n  left: 0;\n  display: inline-block;\n}\n\n.tooltip .tooltiptext {\n  visibility: hidden;\n  font-family: monospace;\n  width: 200px;\n  background-color: #ffffff;\n  color: #000;\n  text-align: center;\n  border-radius: 6px;\n  padding: 5px;\n  position: absolute;\n  z-index: 1;\n  left: 60%;\n  opacity: 0;\n  transition: opacity 0.3s;\n}\n\n.tooltip .tooltiptext::after {\n  content: \"\";\n  position: absolute;\n  top: 100%;\n  left: 50%;\n  margin-left: 5px;\n  border-style: solid;\n}\n\n.tooltip:hover .tooltiptext {\n  visibility: visible;\n  opacity: 1;\n}\n\n.info-icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  font-family: monospace;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  color: #000;\n  background-color: #ffffff;\n  border-radius: 50%;\n}\n`, \"\"]);\n// Exports\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);\n\n\n//# sourceURL=webpack://life-frontend/./styles/styles.css?./node_modules/css-loader/dist/cjs.js");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

eval("\n\n/*\n  MIT License http://www.opensource.org/licenses/mit-license.php\n  Author Tobias Koppers @sokra\n*/\nmodule.exports = function (cssWithMappingToString) {\n  var list = [];\n\n  // return the list of modules as css string\n  list.toString = function toString() {\n    return this.map(function (item) {\n      var content = \"\";\n      var needLayer = typeof item[5] !== \"undefined\";\n      if (item[4]) {\n        content += \"@supports (\".concat(item[4], \") {\");\n      }\n      if (item[2]) {\n        content += \"@media \".concat(item[2], \" {\");\n      }\n      if (needLayer) {\n        content += \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\");\n      }\n      content += cssWithMappingToString(item);\n      if (needLayer) {\n        content += \"}\";\n      }\n      if (item[2]) {\n        content += \"}\";\n      }\n      if (item[4]) {\n        content += \"}\";\n      }\n      return content;\n    }).join(\"\");\n  };\n\n  // import a list of modules into the list\n  list.i = function i(modules, media, dedupe, supports, layer) {\n    if (typeof modules === \"string\") {\n      modules = [[null, modules, undefined]];\n    }\n    var alreadyImportedModules = {};\n    if (dedupe) {\n      for (var k = 0; k < this.length; k++) {\n        var id = this[k][0];\n        if (id != null) {\n          alreadyImportedModules[id] = true;\n        }\n      }\n    }\n    for (var _k = 0; _k < modules.length; _k++) {\n      var item = [].concat(modules[_k]);\n      if (dedupe && alreadyImportedModules[item[0]]) {\n        continue;\n      }\n      if (typeof layer !== \"undefined\") {\n        if (typeof item[5] === \"undefined\") {\n          item[5] = layer;\n        } else {\n          item[1] = \"@layer\".concat(item[5].length > 0 ? \" \".concat(item[5]) : \"\", \" {\").concat(item[1], \"}\");\n          item[5] = layer;\n        }\n      }\n      if (media) {\n        if (!item[2]) {\n          item[2] = media;\n        } else {\n          item[1] = \"@media \".concat(item[2], \" {\").concat(item[1], \"}\");\n          item[2] = media;\n        }\n      }\n      if (supports) {\n        if (!item[4]) {\n          item[4] = \"\".concat(supports);\n        } else {\n          item[1] = \"@supports (\".concat(item[4], \") {\").concat(item[1], \"}\");\n          item[4] = supports;\n        }\n      }\n      list.push(item);\n    }\n  };\n  return list;\n};\n\n//# sourceURL=webpack://life-frontend/./node_modules/css-loader/dist/runtime/api.js?");

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

eval("\n\nmodule.exports = function (i) {\n  return i[1];\n};\n\n//# sourceURL=webpack://life-frontend/./node_modules/css-loader/dist/runtime/noSourceMaps.js?");

/***/ }),

/***/ "./styles/styles.css":
/*!***************************!*\
  !*** ./styles/styles.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ \"./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ \"./node_modules/style-loader/dist/runtime/styleDomAPI.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ \"./node_modules/style-loader/dist/runtime/insertBySelector.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ \"./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ \"./node_modules/style-loader/dist/runtime/insertStyleElement.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ \"./node_modules/style-loader/dist/runtime/styleTagTransform.js\");\n/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./styles.css */ \"./node_modules/css-loader/dist/cjs.js!./styles/styles.css\");\n\n      \n      \n      \n      \n      \n      \n      \n      \n      \n\nvar options = {};\n\noptions.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());\noptions.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());\n\n      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, \"head\");\n    \noptions.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());\noptions.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());\n\nvar update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"], options);\n\n\n\n\n       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__[\"default\"].locals : undefined);\n\n\n//# sourceURL=webpack://life-frontend/./styles/styles.css?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

eval("\n\nvar stylesInDOM = [];\nfunction getIndexByIdentifier(identifier) {\n  var result = -1;\n  for (var i = 0; i < stylesInDOM.length; i++) {\n    if (stylesInDOM[i].identifier === identifier) {\n      result = i;\n      break;\n    }\n  }\n  return result;\n}\nfunction modulesToDom(list, options) {\n  var idCountMap = {};\n  var identifiers = [];\n  for (var i = 0; i < list.length; i++) {\n    var item = list[i];\n    var id = options.base ? item[0] + options.base : item[0];\n    var count = idCountMap[id] || 0;\n    var identifier = \"\".concat(id, \" \").concat(count);\n    idCountMap[id] = count + 1;\n    var indexByIdentifier = getIndexByIdentifier(identifier);\n    var obj = {\n      css: item[1],\n      media: item[2],\n      sourceMap: item[3],\n      supports: item[4],\n      layer: item[5]\n    };\n    if (indexByIdentifier !== -1) {\n      stylesInDOM[indexByIdentifier].references++;\n      stylesInDOM[indexByIdentifier].updater(obj);\n    } else {\n      var updater = addElementStyle(obj, options);\n      options.byIndex = i;\n      stylesInDOM.splice(i, 0, {\n        identifier: identifier,\n        updater: updater,\n        references: 1\n      });\n    }\n    identifiers.push(identifier);\n  }\n  return identifiers;\n}\nfunction addElementStyle(obj, options) {\n  var api = options.domAPI(options);\n  api.update(obj);\n  var updater = function updater(newObj) {\n    if (newObj) {\n      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {\n        return;\n      }\n      api.update(obj = newObj);\n    } else {\n      api.remove();\n    }\n  };\n  return updater;\n}\nmodule.exports = function (list, options) {\n  options = options || {};\n  list = list || [];\n  var lastIdentifiers = modulesToDom(list, options);\n  return function update(newList) {\n    newList = newList || [];\n    for (var i = 0; i < lastIdentifiers.length; i++) {\n      var identifier = lastIdentifiers[i];\n      var index = getIndexByIdentifier(identifier);\n      stylesInDOM[index].references--;\n    }\n    var newLastIdentifiers = modulesToDom(newList, options);\n    for (var _i = 0; _i < lastIdentifiers.length; _i++) {\n      var _identifier = lastIdentifiers[_i];\n      var _index = getIndexByIdentifier(_identifier);\n      if (stylesInDOM[_index].references === 0) {\n        stylesInDOM[_index].updater();\n        stylesInDOM.splice(_index, 1);\n      }\n    }\n    lastIdentifiers = newLastIdentifiers;\n  };\n};\n\n//# sourceURL=webpack://life-frontend/./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

eval("\n\nvar memo = {};\n\n/* istanbul ignore next  */\nfunction getTarget(target) {\n  if (typeof memo[target] === \"undefined\") {\n    var styleTarget = document.querySelector(target);\n\n    // Special case to return head of iframe instead of iframe itself\n    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {\n      try {\n        // This will throw an exception if access to iframe is blocked\n        // due to cross-origin restrictions\n        styleTarget = styleTarget.contentDocument.head;\n      } catch (e) {\n        // istanbul ignore next\n        styleTarget = null;\n      }\n    }\n    memo[target] = styleTarget;\n  }\n  return memo[target];\n}\n\n/* istanbul ignore next  */\nfunction insertBySelector(insert, style) {\n  var target = getTarget(insert);\n  if (!target) {\n    throw new Error(\"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.\");\n  }\n  target.appendChild(style);\n}\nmodule.exports = insertBySelector;\n\n//# sourceURL=webpack://life-frontend/./node_modules/style-loader/dist/runtime/insertBySelector.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction insertStyleElement(options) {\n  var element = document.createElement(\"style\");\n  options.setAttributes(element, options.attributes);\n  options.insert(element, options.options);\n  return element;\n}\nmodule.exports = insertStyleElement;\n\n//# sourceURL=webpack://life-frontend/./node_modules/style-loader/dist/runtime/insertStyleElement.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\n/* istanbul ignore next  */\nfunction setAttributesWithoutAttributes(styleElement) {\n  var nonce =  true ? __webpack_require__.nc : 0;\n  if (nonce) {\n    styleElement.setAttribute(\"nonce\", nonce);\n  }\n}\nmodule.exports = setAttributesWithoutAttributes;\n\n//# sourceURL=webpack://life-frontend/./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction apply(styleElement, options, obj) {\n  var css = \"\";\n  if (obj.supports) {\n    css += \"@supports (\".concat(obj.supports, \") {\");\n  }\n  if (obj.media) {\n    css += \"@media \".concat(obj.media, \" {\");\n  }\n  var needLayer = typeof obj.layer !== \"undefined\";\n  if (needLayer) {\n    css += \"@layer\".concat(obj.layer.length > 0 ? \" \".concat(obj.layer) : \"\", \" {\");\n  }\n  css += obj.css;\n  if (needLayer) {\n    css += \"}\";\n  }\n  if (obj.media) {\n    css += \"}\";\n  }\n  if (obj.supports) {\n    css += \"}\";\n  }\n  var sourceMap = obj.sourceMap;\n  if (sourceMap && typeof btoa !== \"undefined\") {\n    css += \"\\n/*# sourceMappingURL=data:application/json;base64,\".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), \" */\");\n  }\n\n  // For old IE\n  /* istanbul ignore if  */\n  options.styleTagTransform(css, styleElement, options.options);\n}\nfunction removeStyleElement(styleElement) {\n  // istanbul ignore if\n  if (styleElement.parentNode === null) {\n    return false;\n  }\n  styleElement.parentNode.removeChild(styleElement);\n}\n\n/* istanbul ignore next  */\nfunction domAPI(options) {\n  if (typeof document === \"undefined\") {\n    return {\n      update: function update() {},\n      remove: function remove() {}\n    };\n  }\n  var styleElement = options.insertStyleElement(options);\n  return {\n    update: function update(obj) {\n      apply(styleElement, options, obj);\n    },\n    remove: function remove() {\n      removeStyleElement(styleElement);\n    }\n  };\n}\nmodule.exports = domAPI;\n\n//# sourceURL=webpack://life-frontend/./node_modules/style-loader/dist/runtime/styleDomAPI.js?");

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

eval("\n\n/* istanbul ignore next  */\nfunction styleTagTransform(css, styleElement) {\n  if (styleElement.styleSheet) {\n    styleElement.styleSheet.cssText = css;\n  } else {\n    while (styleElement.firstChild) {\n      styleElement.removeChild(styleElement.firstChild);\n    }\n    styleElement.appendChild(document.createTextNode(css));\n  }\n}\nmodule.exports = styleTagTransform;\n\n//# sourceURL=webpack://life-frontend/./node_modules/style-loader/dist/runtime/styleTagTransform.js?");

/***/ }),

/***/ "./src/canvas.ts":
/*!***********************!*\
  !*** ./src/canvas.ts ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MODE_EDIT: () => (/* binding */ MODE_EDIT),\n/* harmony export */   MODE_PAN: () => (/* binding */ MODE_PAN),\n/* harmony export */   View: () => (/* binding */ View)\n/* harmony export */ });\n/* harmony import */ var wasm_crate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wasm-crate */ \"../pkg/life_new.js\");\n/* harmony import */ var wasm_crate_life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wasm-crate/life_new_bg.wasm */ \"../pkg/life_new_bg.wasm\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wasm_crate__WEBPACK_IMPORTED_MODULE_0__, wasm_crate_life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__]);\n([wasm_crate__WEBPACK_IMPORTED_MODULE_0__, wasm_crate_life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\nconst MODE_PAN = \"PAN\";\nconst MODE_EDIT = \"EDIT\";\nclass View {\n    canvas;\n    ctx;\n    universe;\n    animation_id;\n    // The wasm render buffer is kept at half the canvas resolution and scaled\n    // up 2x when blitted, cutting rasterization cost ~4x.\n    bufW;\n    bufH;\n    offscreen;\n    offscreenCtx;\n    // Viewport expressed in world (cell) coordinates.\n    // center is the world cell at the canvas center.\n    center_x;\n    center_y;\n    // scale: screen pixels per world cell. Zoom in raises it, zoom out lowers it.\n    scale;\n    levels;\n    MODE = MODE_PAN;\n    panBtn;\n    editBtn;\n    genBox;\n    constructor(id, width, height, pixels_per_cell, levels) {\n        this.canvas = document.getElementById(id);\n        this.canvas.height = height;\n        this.canvas.width = width;\n        this.animation_id = null;\n        this.ctx = this.canvas.getContext('2d');\n        this.offscreen = document.createElement('canvas');\n        this.offscreenCtx = this.offscreen.getContext('2d');\n        this.levels = levels;\n        this.panBtn = document.getElementById('mode-pan');\n        this.editBtn = document.getElementById('mode-edit');\n        this.genBox = document.getElementById('gen-value');\n        this.panBtn.addEventListener('click', () => this.setMode(MODE_PAN));\n        this.editBtn.addEventListener('click', () => this.setMode(MODE_EDIT));\n        this.bufW = Math.ceil(width / 2);\n        this.bufH = Math.ceil(height / 2);\n        this.offscreen.width = this.bufW;\n        this.offscreen.height = this.bufH;\n        // The fixed RGBA buffer lives inside wasm at half the canvas resolution.\n        this.universe = wasm_crate__WEBPACK_IMPORTED_MODULE_0__.Universe.new(levels, this.bufW, this.bufH);\n        this.center_x = 0;\n        this.center_y = 0;\n        this.scale = pixels_per_cell;\n    }\n    setCanvasDimensions(width, height) {\n        // The wasm buffer is fixed at the (half) canvas resolution, so resizing\n        // means reallocating the buffer via a fresh universe (sim state resets).\n        this.canvas.width = width;\n        this.canvas.height = height;\n        this.bufW = Math.ceil(width / 2);\n        this.bufH = Math.ceil(height / 2);\n        this.offscreen.width = this.bufW;\n        this.offscreen.height = this.bufH;\n        this.universe = wasm_crate__WEBPACK_IMPORTED_MODULE_0__.Universe.new(this.levels, this.bufW, this.bufH);\n        this.updateGen();\n    }\n    setMode(mode) {\n        this.MODE = mode;\n        this.panBtn.classList.toggle('active', mode === MODE_PAN);\n        this.editBtn.classList.toggle('active', mode === MODE_EDIT);\n    }\n    /// Refresh the generation readout from the wasm universe.\n    updateGen() {\n        this.genBox.innerText = String(this.universe.generation());\n    }\n    /// Map a screen (client) point to the world cell under the cursor.\n    screenToWorld(x, y) {\n        const wx = this.center_x + (x - this.canvas.width / 2) / this.scale;\n        const wy = this.center_y + (y - this.canvas.height / 2) / this.scale;\n        return [Math.floor(wx), Math.floor(wy)];\n    }\n    /// Rasterize the visible viewport into the wasm buffer, then upscale and\n    /// blit it to the canvas in a single drawImage — no per-cell drawing.\n    render() {\n        const vpw = this.canvas.width;\n        const vph = this.canvas.height;\n        // Visible extent in world cells.\n        const half_w = vpw / (2 * this.scale);\n        const half_h = vph / (2 * this.scale);\n        const nw_x = Math.floor(this.center_x - half_w);\n        const nw_y = Math.floor(this.center_y - half_h);\n        const se_x = Math.ceil(this.center_x + half_w);\n        const se_y = Math.ceil(this.center_y + half_h);\n        const ptr = this.universe.rasterize(nw_x, nw_y, se_x, se_y);\n        // Rebuild the view from memory.buffer each frame (wasm memory may grow).\n        const img = new ImageData(new Uint8ClampedArray(wasm_crate_life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__.memory.buffer, ptr, this.bufW * this.bufH * 4), this.bufW, this.bufH);\n        this.offscreenCtx.putImageData(img, 0, 0);\n        // Nearest-neighbor 2x upscale for crisp cells.\n        this.ctx.imageSmoothingEnabled = false;\n        this.ctx.drawImage(this.offscreen, 0, 0, this.bufW, this.bufH, 0, 0, vpw, vph);\n    }\n    clearUniverse() {\n        this.universe.reset();\n        this.updateGen();\n        this.render();\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://life-frontend/./src/canvas.ts?");

/***/ }),

/***/ "./src/handler.ts":
/*!************************!*\
  !*** ./src/handler.ts ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   MouseHandler: () => (/* binding */ MouseHandler)\n/* harmony export */ });\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ \"./src/canvas.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_canvas__WEBPACK_IMPORTED_MODULE_0__]);\n_canvas__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\nfunction clamp(x, max, min) {\n    return Math.max(min, Math.min(x, max));\n}\nclass MouseHandler {\n    isDragging = false;\n    dragStartX = 0;\n    dragStartY = 0;\n    lastToggled = [-1, -1];\n    view;\n    constructor(view) {\n        this.view = view;\n    }\n    handleMouseMove = (event) => {\n        const view = this.view;\n        if (view.MODE == _canvas__WEBPACK_IMPORTED_MODULE_0__.MODE_PAN && this.isDragging) {\n            const deltaX = event.clientX - this.dragStartX;\n            const deltaY = event.clientY - this.dragStartY;\n            // Grab: content follows the cursor.\n            view.center_x -= deltaX / view.scale;\n            view.center_y -= deltaY / view.scale;\n            this.dragStartX = event.clientX;\n            this.dragStartY = event.clientY;\n            view.render();\n        }\n        else if (view.MODE == _canvas__WEBPACK_IMPORTED_MODULE_0__.MODE_EDIT && this.isDragging) {\n            let [x, y] = view.screenToWorld(event.clientX, event.clientY);\n            if ([x, y].toString() === this.lastToggled.toString())\n                return;\n            view.universe.toggle(x, y);\n            this.lastToggled = [x, y];\n            view.render();\n        }\n    };\n    handleMouseDown = (event) => {\n        const view = this.view;\n        this.isDragging = true;\n        this.dragStartX = event.clientX;\n        this.dragStartY = event.clientY;\n        if (view.MODE == _canvas__WEBPACK_IMPORTED_MODULE_0__.MODE_EDIT) {\n            let [x, y] = view.screenToWorld(event.clientX, event.clientY);\n            view.universe.toggle(x, y);\n            view.render();\n        }\n    };\n    handleWheel = (event) => {\n        const canvas = this.view.canvas;\n        const view = this.view;\n        const wheelDelta = event.deltaY > 0 ? 1.1 : 0.9;\n        const wx = view.center_x + (event.clientX - canvas.width / 2) / view.scale;\n        const wy = view.center_y + (event.clientY - canvas.height / 2) / view.scale;\n        view.scale = clamp(view.scale / wheelDelta, 100, 1e-3);\n        // Keep the world point under the cursor fixed while zooming.\n        view.center_x = wx - (event.clientX - canvas.width / 2) / view.scale;\n        view.center_y = wy - (event.clientY - canvas.height / 2) / view.scale;\n        view.render();\n    };\n    handleMouseUp = () => {\n        this.isDragging = false;\n    };\n    init() {\n        this.view.canvas.addEventListener(\"wheel\", this.handleWheel);\n        this.view.canvas.addEventListener(\"mouseup\", this.handleMouseUp);\n        this.view.canvas.addEventListener(\"mousedown\", this.handleMouseDown);\n        this.view.canvas.addEventListener(\"mousemove\", this.handleMouseMove);\n    }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://life-frontend/./src/handler.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../styles/styles.css */ \"./styles/styles.css\");\n/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ \"./src/canvas.ts\");\n/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./handler */ \"./src/handler.ts\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_canvas__WEBPACK_IMPORTED_MODULE_1__, _handler__WEBPACK_IMPORTED_MODULE_2__]);\n([_canvas__WEBPACK_IMPORTED_MODULE_1__, _handler__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nconst container = document.getElementById('canvas-container');\nconst BLOCK_WIDTH = 10;\nlet animation_id = null;\nconst view = new _canvas__WEBPACK_IMPORTED_MODULE_1__.View('game-of-life-canvas', container.clientWidth, container.clientHeight, BLOCK_WIDTH, 30);\nconst eh = new _handler__WEBPACK_IMPORTED_MODULE_2__.MouseHandler(view);\nfunction handleKeyDown(event) {\n    switch (event.code) {\n        case \"Space\":\n            if (animation_id === null) {\n                run();\n            }\n            else {\n                cancelAnimationFrame(animation_id);\n                animation_id = null;\n            }\n            break;\n        case \"KeyI\":\n            view.setMode(view.MODE === _canvas__WEBPACK_IMPORTED_MODULE_1__.MODE_EDIT ? _canvas__WEBPACK_IMPORTED_MODULE_1__.MODE_PAN : _canvas__WEBPACK_IMPORTED_MODULE_1__.MODE_EDIT);\n            break;\n        case \"Escape\":\n            view.setMode(_canvas__WEBPACK_IMPORTED_MODULE_1__.MODE_PAN);\n            break;\n        case \"KeyR\":\n            if (view.MODE === _canvas__WEBPACK_IMPORTED_MODULE_1__.MODE_EDIT)\n                view.clearUniverse();\n            break;\n        default:\n            break;\n    }\n}\n// Arbitrary generation advance: step the sim by the input amount.\nconst stepBtn = document.getElementById('step-btn');\nconst stepAmount = document.getElementById('step-amount');\nfunction handleStep() {\n    const n = Math.max(1, Math.floor(Number(stepAmount.value) || 1));\n    view.universe.step(n);\n    view.updateGen();\n    view.render();\n}\nstepBtn.addEventListener('click', handleStep);\nstepAmount.addEventListener('keydown', (e) => {\n    if (e.key === 'Enter')\n        handleStep();\n});\nwindow.addEventListener('keydown', handleKeyDown);\nwindow.addEventListener('resize', () => {\n    let width = Math.round(container.clientWidth / 10) * BLOCK_WIDTH;\n    let height = Math.round(container.clientHeight / 10) * BLOCK_WIDTH;\n    view.setCanvasDimensions(width, height);\n    view.render();\n});\nclass FPS {\n    fps;\n    frames;\n    lastFrameTimeStamp;\n    constructor() {\n        this.fps = document.getElementById(\"fps\");\n        this.frames = [];\n        this.lastFrameTimeStamp = performance.now();\n    }\n    render() {\n        // Convert the delta time since the last frame render into a measure\n        // of frames per second.\n        const now = performance.now();\n        const delta = now - this.lastFrameTimeStamp;\n        this.lastFrameTimeStamp = now;\n        const fps = 1 / delta * 1000;\n        // Save only the latest 100 timings.\n        this.frames.push(fps);\n        if (this.frames.length > 100) {\n            this.frames.shift();\n        }\n        // Find the max, min, and mean of our 100 latest timings.\n        let min = Infinity;\n        let max = -Infinity;\n        let sum = 0;\n        for (let i = 0; i < this.frames.length; i++) {\n            sum += this.frames[i];\n            min = Math.min(this.frames[i], min);\n            max = Math.max(this.frames[i], max);\n        }\n        let mean = sum / this.frames.length;\n        // Render the statistics.\n        this.fps.textContent = `\nFrames per Second:\n         latest = ${Math.round(fps)}\navg of last 100 = ${Math.round(mean)}\nmin of last 100 = ${Math.round(min)}\nmax of last 100 = ${Math.round(max)}\n`.trim();\n    }\n}\nconst fps = new FPS();\neh.init();\nfunction run() {\n    view.universe.tick();\n    view.updateGen();\n    fps.render();\n    view.render();\n    animation_id = requestAnimationFrame(run);\n}\nview.render();\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://life-frontend/./src/index.ts?");

/***/ }),

/***/ "../pkg/life_new.js":
/*!**************************!*\
  !*** ../pkg/life_new.js ***!
  \**************************/
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Universe: () => (/* reexport safe */ _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.Universe),\n/* harmony export */   __wbg_error_f851667af71bcfc6: () => (/* reexport safe */ _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_error_f851667af71bcfc6),\n/* harmony export */   __wbg_new_abda76e883ba8a5f: () => (/* reexport safe */ _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_new_abda76e883ba8a5f),\n/* harmony export */   __wbg_set_wasm: () => (/* reexport safe */ _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_set_wasm),\n/* harmony export */   __wbg_stack_658279fe44541cf6: () => (/* reexport safe */ _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_stack_658279fe44541cf6),\n/* harmony export */   __wbindgen_object_drop_ref: () => (/* reexport safe */ _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_object_drop_ref),\n/* harmony export */   __wbindgen_throw: () => (/* reexport safe */ _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbindgen_throw)\n/* harmony export */ });\n/* harmony import */ var _life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./life_new_bg.wasm */ \"../pkg/life_new_bg.wasm\");\n/* harmony import */ var _life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./life_new_bg.js */ \"../pkg/life_new_bg.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__]);\n_life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n(0,_life_new_bg_js__WEBPACK_IMPORTED_MODULE_0__.__wbg_set_wasm)(_life_new_bg_wasm__WEBPACK_IMPORTED_MODULE_1__);\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://life-frontend/../pkg/life_new.js?");

/***/ }),

/***/ "../pkg/life_new_bg.js":
/*!*****************************!*\
  !*** ../pkg/life_new_bg.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Universe: () => (/* binding */ Universe),\n/* harmony export */   __wbg_error_f851667af71bcfc6: () => (/* binding */ __wbg_error_f851667af71bcfc6),\n/* harmony export */   __wbg_new_abda76e883ba8a5f: () => (/* binding */ __wbg_new_abda76e883ba8a5f),\n/* harmony export */   __wbg_set_wasm: () => (/* binding */ __wbg_set_wasm),\n/* harmony export */   __wbg_stack_658279fe44541cf6: () => (/* binding */ __wbg_stack_658279fe44541cf6),\n/* harmony export */   __wbindgen_object_drop_ref: () => (/* binding */ __wbindgen_object_drop_ref),\n/* harmony export */   __wbindgen_throw: () => (/* binding */ __wbindgen_throw)\n/* harmony export */ });\nlet wasm;\nfunction __wbg_set_wasm(val) {\n    wasm = val;\n}\n\n\nconst heap = new Array(128).fill(undefined);\n\nheap.push(undefined, null, true, false);\n\nfunction getObject(idx) { return heap[idx]; }\n\nlet heap_next = heap.length;\n\nfunction dropObject(idx) {\n    if (idx < 132) return;\n    heap[idx] = heap_next;\n    heap_next = idx;\n}\n\nfunction takeObject(idx) {\n    const ret = getObject(idx);\n    dropObject(idx);\n    return ret;\n}\n\nconst lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;\n\nlet cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachedUint8Memory0 = null;\n\nfunction getUint8Memory0() {\n    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {\n        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);\n    }\n    return cachedUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    ptr = ptr >>> 0;\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n\nfunction addHeapObject(obj) {\n    if (heap_next === heap.length) heap.push(heap.length + 1);\n    const idx = heap_next;\n    heap_next = heap[idx];\n\n    heap[idx] = obj;\n    return idx;\n}\n\nlet WASM_VECTOR_LEN = 0;\n\nconst lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;\n\nlet cachedTextEncoder = new lTextEncoder('utf-8');\n\nconst encodeString = (typeof cachedTextEncoder.encodeInto === 'function'\n    ? function (arg, view) {\n    return cachedTextEncoder.encodeInto(arg, view);\n}\n    : function (arg, view) {\n    const buf = cachedTextEncoder.encode(arg);\n    view.set(buf);\n    return {\n        read: arg.length,\n        written: buf.length\n    };\n});\n\nfunction passStringToWasm0(arg, malloc, realloc) {\n\n    if (realloc === undefined) {\n        const buf = cachedTextEncoder.encode(arg);\n        const ptr = malloc(buf.length, 1) >>> 0;\n        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);\n        WASM_VECTOR_LEN = buf.length;\n        return ptr;\n    }\n\n    let len = arg.length;\n    let ptr = malloc(len, 1) >>> 0;\n\n    const mem = getUint8Memory0();\n\n    let offset = 0;\n\n    for (; offset < len; offset++) {\n        const code = arg.charCodeAt(offset);\n        if (code > 0x7F) break;\n        mem[ptr + offset] = code;\n    }\n\n    if (offset !== len) {\n        if (offset !== 0) {\n            arg = arg.slice(offset);\n        }\n        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;\n        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);\n        const ret = encodeString(arg, view);\n\n        offset += ret.written;\n        ptr = realloc(ptr, len, offset, 1) >>> 0;\n    }\n\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n}\n\nlet cachedInt32Memory0 = null;\n\nfunction getInt32Memory0() {\n    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {\n        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);\n    }\n    return cachedInt32Memory0;\n}\n\nconst UniverseFinalization = (typeof FinalizationRegistry === 'undefined')\n    ? { register: () => {}, unregister: () => {} }\n    : new FinalizationRegistry(ptr => wasm.__wbg_universe_free(ptr >>> 0));\n/**\n* wasm-exposed wrapper around the hash life universe plus a fixed RGBA pixel\n* buffer for rasterized rendering.\n*\n* The buffer is `vpw x vph` RGBA (row-major, `vpw*vph*4` bytes), allocated\n* once in `new` and never resized during steady-state rendering, so the\n* pointer returned by `buffer_ptr`/`rasterize` stays stable as long as wasm\n* memory does not grow.\n*/\nclass Universe {\n\n    static __wrap(ptr) {\n        ptr = ptr >>> 0;\n        const obj = Object.create(Universe.prototype);\n        obj.__wbg_ptr = ptr;\n        UniverseFinalization.register(obj, obj.__wbg_ptr, obj);\n        return obj;\n    }\n\n    __destroy_into_raw() {\n        const ptr = this.__wbg_ptr;\n        this.__wbg_ptr = 0;\n        UniverseFinalization.unregister(this);\n        return ptr;\n    }\n\n    free() {\n        const ptr = this.__destroy_into_raw();\n        wasm.__wbg_universe_free(ptr);\n    }\n    /**\n    * Return the byte length of the fixed RGBA buffer.\n    * @returns {number}\n    */\n    buffer_len() {\n        const ret = wasm.universe_buffer_len(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * Return the address of the fixed RGBA buffer, for re-wrapping the view\n    * each frame. Size is `vpw*vph*4` bytes.\n    * @returns {number}\n    */\n    buffer_ptr() {\n        const ret = wasm.universe_buffer_ptr(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * Number of generations the simulation has advanced.\n    * @returns {bigint}\n    */\n    generation() {\n        const ret = wasm.universe_generation(this.__wbg_ptr);\n        return BigInt.asUintN(64, ret);\n    }\n    /**\n    * Total live-cell population of the universe.\n    * @returns {number}\n    */\n    population() {\n        const ret = wasm.universe_population(this.__wbg_ptr);\n        return ret >>> 0;\n    }\n    /**\n    * Create a new universe with `levels` quadtree levels and a fixed\n    * `vpw x vph` RGBA render buffer.\n    * @param {number} levels\n    * @param {number} vpw\n    * @param {number} vph\n    * @returns {Universe}\n    */\n    static new(levels, vpw, vph) {\n        const ret = wasm.universe_new(levels, vpw, vph);\n        return Universe.__wrap(ret);\n    }\n    /**\n    * Advance the simulation by `by` generations.\n    * @param {number} by\n    */\n    step(by) {\n        wasm.universe_step(this.__wbg_ptr, by);\n    }\n    /**\n    * Advance the simulation by a single generation.\n    */\n    tick() {\n        wasm.universe_tick(this.__wbg_ptr);\n    }\n    /**\n    * Reset the universe to an empty state.\n    */\n    reset() {\n        wasm.universe_reset(this.__wbg_ptr);\n    }\n    /**\n    * Toggle the cell at world coordinate `(x, y)`.\n    * @param {number} x\n    * @param {number} y\n    */\n    toggle(x, y) {\n        wasm.universe_toggle(this.__wbg_ptr, x, y);\n    }\n    /**\n    * Rasterize the viewport `[nw, se)` (world coordinates) into the fixed\n    * RGBA buffer, then return the buffer's address so JS can wrap it in an\n    * `ImageData`. Returns 0 if the buffer cannot be addressed.\n    * @param {number} nw_x\n    * @param {number} nw_y\n    * @param {number} se_x\n    * @param {number} se_y\n    * @returns {number}\n    */\n    rasterize(nw_x, nw_y, se_x, se_y) {\n        const ret = wasm.universe_rasterize(this.__wbg_ptr, nw_x, nw_y, se_x, se_y);\n        return ret >>> 0;\n    }\n}\n\nfunction __wbg_new_abda76e883ba8a5f() {\n    const ret = new Error();\n    return addHeapObject(ret);\n};\n\nfunction __wbg_stack_658279fe44541cf6(arg0, arg1) {\n    const ret = getObject(arg1).stack;\n    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);\n    const len1 = WASM_VECTOR_LEN;\n    getInt32Memory0()[arg0 / 4 + 1] = len1;\n    getInt32Memory0()[arg0 / 4 + 0] = ptr1;\n};\n\nfunction __wbg_error_f851667af71bcfc6(arg0, arg1) {\n    let deferred0_0;\n    let deferred0_1;\n    try {\n        deferred0_0 = arg0;\n        deferred0_1 = arg1;\n        console.error(getStringFromWasm0(arg0, arg1));\n    } finally {\n        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);\n    }\n};\n\nfunction __wbindgen_object_drop_ref(arg0) {\n    takeObject(arg0);\n};\n\nfunction __wbindgen_throw(arg0, arg1) {\n    throw new Error(getStringFromWasm0(arg0, arg1));\n};\n\n\n\n//# sourceURL=webpack://life-frontend/../pkg/life_new_bg.js?");

/***/ }),

/***/ "../pkg/life_new_bg.wasm":
/*!*******************************!*\
  !*** ../pkg/life_new_bg.wasm ***!
  \*******************************/
/***/ ((module, exports, __webpack_require__) => {

eval("/* harmony import */ var WEBPACK_IMPORTED_MODULE_0 = __webpack_require__(/*! ./life_new_bg.js */ \"../pkg/life_new_bg.js\");\nmodule.exports = __webpack_require__.v(exports, module.id, \"55a2204d502967ba3098\", {\n\t\"./life_new_bg.js\": {\n\t\t\"__wbg_new_abda76e883ba8a5f\": WEBPACK_IMPORTED_MODULE_0.__wbg_new_abda76e883ba8a5f,\n\t\t\"__wbg_stack_658279fe44541cf6\": WEBPACK_IMPORTED_MODULE_0.__wbg_stack_658279fe44541cf6,\n\t\t\"__wbg_error_f851667af71bcfc6\": WEBPACK_IMPORTED_MODULE_0.__wbg_error_f851667af71bcfc6,\n\t\t\"__wbindgen_object_drop_ref\": WEBPACK_IMPORTED_MODULE_0.__wbindgen_object_drop_ref,\n\t\t\"__wbindgen_throw\": WEBPACK_IMPORTED_MODULE_0.__wbindgen_throw\n\t}\n});\n\n//# sourceURL=webpack://life-frontend/../pkg/life_new_bg.wasm?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/wasm loading */
/******/ 	(() => {
/******/ 		__webpack_require__.v = (exports, wasmModuleId, wasmModuleHash, importsObj) => {
/******/ 			var req = fetch(__webpack_require__.p + "" + wasmModuleHash + ".module.wasm");
/******/ 			var fallback = () => (req
/******/ 				.then((x) => (x.arrayBuffer()))
/******/ 				.then((bytes) => (WebAssembly.instantiate(bytes, importsObj)))
/******/ 				.then((res) => (Object.assign(exports, res.instance.exports))));
/******/ 			return req.then((res) => {
/******/ 				if (typeof WebAssembly.instantiateStreaming === "function") {
/******/ 					return WebAssembly.instantiateStreaming(res, importsObj)
/******/ 						.then(
/******/ 							(res) => (Object.assign(exports, res.instance.exports)),
/******/ 							(e) => {
/******/ 								if(res.headers.get("Content-Type") !== "application/wasm") {
/******/ 									console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
/******/ 									return fallback();
/******/ 								}
/******/ 								throw e;
/******/ 							}
/******/ 						);
/******/ 				}
/******/ 				return fallback();
/******/ 			});
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;