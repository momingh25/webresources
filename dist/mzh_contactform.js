/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var cds;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Forms/ContactForm.ts":
/*!**********************************!*\
  !*** ./src/Forms/ContactForm.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ContactForm: () => (/* binding */ ContactForm)\n/* harmony export */ });\n/* harmony import */ var _constants_EntityAttributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/EntityAttributes */ \"./src/constants/EntityAttributes.ts\");\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\n// Using @types/xrm - no imports needed, Xrm is globally available\n\nclass ContactForm {\n    static onLoad(context) {\n        return __awaiter(this, void 0, void 0, function* () {\n            const formContext = context.getFormContext();\n            console.log(\"ContactForm loaded\");\n            // Example: Add validation to email field\n            const emailAttribute = formContext.getAttribute(_constants_EntityAttributes__WEBPACK_IMPORTED_MODULE_0__.ContactAttributes.EmailAddress1);\n            if (emailAttribute) {\n                emailAttribute.addOnChange(ContactForm.onEmailChanged);\n            }\n        });\n    }\n    static onEmailChanged(context) {\n        const formContext = context.getFormContext();\n        const emailAttribute = formContext.getAttribute(_constants_EntityAttributes__WEBPACK_IMPORTED_MODULE_0__.ContactAttributes.EmailAddress1);\n        if (!emailAttribute || !emailAttribute.getValue())\n            return;\n        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n        const isValid = emailRegex.test(emailAttribute.getValue());\n        emailAttribute.controls.forEach((control) => {\n            if (isValid) {\n                control.clearNotification(_constants_EntityAttributes__WEBPACK_IMPORTED_MODULE_0__.ContactAttributes.EmailAddress1);\n            }\n            else {\n                control.setNotification(\"Please enter a valid email address TEST\", _constants_EntityAttributes__WEBPACK_IMPORTED_MODULE_0__.ContactAttributes.EmailAddress1);\n            }\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvRm9ybXMvQ29udGFjdEZvcm0udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrRUFBa0U7QUFDQTtBQUUzRCxNQUFNLFdBQVc7SUFDdEIsTUFBTSxDQUFPLE1BQU0sQ0FBQyxPQUFnQzs7WUFDbEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVsQyx5Q0FBeUM7WUFDekMsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQywwRUFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNqRixJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUNuQixjQUFjLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUN6RCxDQUFDO1FBQ0gsQ0FBQztLQUFBO0lBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFnQztRQUNwRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDN0MsTUFBTSxjQUFjLEdBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQywwRUFBaUIsQ0FBQyxhQUFhLENBQW1DLENBQUM7UUFFbkgsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUU7WUFBRSxPQUFPO1FBRTFELE1BQU0sVUFBVSxHQUFHLDRCQUE0QixDQUFDO1FBQ2hELE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFM0QsY0FBYyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMxQyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUNYLE9BQXNDLENBQUMsaUJBQWlCLENBQUMsMEVBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDN0YsQ0FBQztpQkFBTSxDQUFDO2dCQUNMLE9BQXNDLENBQUMsZUFBZSxDQUNyRCx5Q0FBeUMsRUFDekMsMEVBQWlCLENBQUMsYUFBYSxDQUNoQyxDQUFDO1lBQ0osQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2RzLy4vc3JjL0Zvcm1zL0NvbnRhY3RGb3JtLnRzP2JmMjMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVXNpbmcgQHR5cGVzL3hybSAtIG5vIGltcG9ydHMgbmVlZGVkLCBYcm0gaXMgZ2xvYmFsbHkgYXZhaWxhYmxlXHJcbmltcG9ydCB7IENvbnRhY3RBdHRyaWJ1dGVzIH0gZnJvbSBcIi4uL2NvbnN0YW50cy9FbnRpdHlBdHRyaWJ1dGVzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udGFjdEZvcm0ge1xyXG4gIHN0YXRpYyBhc3luYyBvbkxvYWQoY29udGV4dDogWHJtLkV2ZW50cy5FdmVudENvbnRleHQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIGNvbnN0IGZvcm1Db250ZXh0ID0gY29udGV4dC5nZXRGb3JtQ29udGV4dCgpO1xyXG4gICAgY29uc29sZS5sb2coXCJDb250YWN0Rm9ybSBsb2FkZWRcIik7XHJcbiAgICBcclxuICAgIC8vIEV4YW1wbGU6IEFkZCB2YWxpZGF0aW9uIHRvIGVtYWlsIGZpZWxkXHJcbiAgICBjb25zdCBlbWFpbEF0dHJpYnV0ZSA9IGZvcm1Db250ZXh0LmdldEF0dHJpYnV0ZShDb250YWN0QXR0cmlidXRlcy5FbWFpbEFkZHJlc3MxKTtcclxuICAgIGlmIChlbWFpbEF0dHJpYnV0ZSkge1xyXG4gICAgICBlbWFpbEF0dHJpYnV0ZS5hZGRPbkNoYW5nZShDb250YWN0Rm9ybS5vbkVtYWlsQ2hhbmdlZCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIHN0YXRpYyBvbkVtYWlsQ2hhbmdlZChjb250ZXh0OiBYcm0uRXZlbnRzLkV2ZW50Q29udGV4dCk6IHZvaWQge1xyXG4gICAgY29uc3QgZm9ybUNvbnRleHQgPSBjb250ZXh0LmdldEZvcm1Db250ZXh0KCk7XHJcbiAgICBjb25zdCBlbWFpbEF0dHJpYnV0ZSA9IGZvcm1Db250ZXh0LmdldEF0dHJpYnV0ZShDb250YWN0QXR0cmlidXRlcy5FbWFpbEFkZHJlc3MxKSBhcyBYcm0uQXR0cmlidXRlcy5TdHJpbmdBdHRyaWJ1dGU7XHJcbiAgICBcclxuICAgIGlmICghZW1haWxBdHRyaWJ1dGUgfHwgIWVtYWlsQXR0cmlidXRlLmdldFZhbHVlKCkpIHJldHVybjtcclxuICAgIFxyXG4gICAgY29uc3QgZW1haWxSZWdleCA9IC9eW15cXHNAXStAW15cXHNAXStcXC5bXlxcc0BdKyQvO1xyXG4gICAgY29uc3QgaXNWYWxpZCA9IGVtYWlsUmVnZXgudGVzdChlbWFpbEF0dHJpYnV0ZS5nZXRWYWx1ZSgpKTtcclxuICAgIFxyXG4gICAgZW1haWxBdHRyaWJ1dGUuY29udHJvbHMuZm9yRWFjaCgoY29udHJvbCkgPT4ge1xyXG4gICAgICBpZiAoaXNWYWxpZCkge1xyXG4gICAgICAgIChjb250cm9sIGFzIFhybS5Db250cm9scy5TdHJpbmdDb250cm9sKS5jbGVhck5vdGlmaWNhdGlvbihDb250YWN0QXR0cmlidXRlcy5FbWFpbEFkZHJlc3MxKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAoY29udHJvbCBhcyBYcm0uQ29udHJvbHMuU3RyaW5nQ29udHJvbCkuc2V0Tm90aWZpY2F0aW9uKFxyXG4gICAgICAgICAgXCJQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzIFRFU1RcIiwgXHJcbiAgICAgICAgICBDb250YWN0QXR0cmlidXRlcy5FbWFpbEFkZHJlc3MxXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/Forms/ContactForm.ts\n\n}");

/***/ }),

/***/ "./src/constants/EntityAttributes.ts":
/*!*******************************************!*\
  !*** ./src/constants/EntityAttributes.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AccountAttributes: () => (/* binding */ AccountAttributes),\n/* harmony export */   ContactAttributes: () => (/* binding */ ContactAttributes),\n/* harmony export */   OpportunityAttributes: () => (/* binding */ OpportunityAttributes)\n/* harmony export */ });\n// Entity attribute logical names for type safety\nconst AccountAttributes = {\n    WebSiteURL: \"websiteurl\",\n    Name: \"name\",\n    AccountNumber: \"accountnumber\",\n    PrimaryContactId: \"primarycontactid\",\n    // Add more as needed\n};\nconst ContactAttributes = {\n    FirstName: \"firstname\",\n    LastName: \"lastname\",\n    EmailAddress1: \"emailaddress1\",\n    // Add more as needed\n};\nconst OpportunityAttributes = {\n    Name: \"name\",\n    EstimatedValue: \"estimatedvalue\",\n    CustomerId: \"customerid\",\n    // Add more as needed\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29uc3RhbnRzL0VudGl0eUF0dHJpYnV0ZXMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsaURBQWlEO0FBQzFDLE1BQU0saUJBQWlCLEdBQUc7SUFDL0IsVUFBVSxFQUFFLFlBQVk7SUFDeEIsSUFBSSxFQUFFLE1BQU07SUFDWixhQUFhLEVBQUUsZUFBZTtJQUM5QixnQkFBZ0IsRUFBRSxrQkFBa0I7SUFDcEMscUJBQXFCO0NBQ2IsQ0FBQztBQUVKLE1BQU0saUJBQWlCLEdBQUc7SUFDL0IsU0FBUyxFQUFFLFdBQVc7SUFDdEIsUUFBUSxFQUFFLFVBQVU7SUFDcEIsYUFBYSxFQUFFLGVBQWU7SUFDOUIscUJBQXFCO0NBQ2IsQ0FBQztBQUVKLE1BQU0scUJBQXFCLEdBQUc7SUFDbkMsSUFBSSxFQUFFLE1BQU07SUFDWixjQUFjLEVBQUUsZ0JBQWdCO0lBQ2hDLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLHFCQUFxQjtDQUNiLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZHMvLi9zcmMvY29uc3RhbnRzL0VudGl0eUF0dHJpYnV0ZXMudHM/Y2UzYSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBFbnRpdHkgYXR0cmlidXRlIGxvZ2ljYWwgbmFtZXMgZm9yIHR5cGUgc2FmZXR5XHJcbmV4cG9ydCBjb25zdCBBY2NvdW50QXR0cmlidXRlcyA9IHtcclxuICBXZWJTaXRlVVJMOiBcIndlYnNpdGV1cmxcIixcclxuICBOYW1lOiBcIm5hbWVcIixcclxuICBBY2NvdW50TnVtYmVyOiBcImFjY291bnRudW1iZXJcIixcclxuICBQcmltYXJ5Q29udGFjdElkOiBcInByaW1hcnljb250YWN0aWRcIixcclxuICAvLyBBZGQgbW9yZSBhcyBuZWVkZWRcclxufSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBDb250YWN0QXR0cmlidXRlcyA9IHtcclxuICBGaXJzdE5hbWU6IFwiZmlyc3RuYW1lXCIsXHJcbiAgTGFzdE5hbWU6IFwibGFzdG5hbWVcIixcclxuICBFbWFpbEFkZHJlc3MxOiBcImVtYWlsYWRkcmVzczFcIixcclxuICAvLyBBZGQgbW9yZSBhcyBuZWVkZWRcclxufSBhcyBjb25zdDtcclxuXHJcbmV4cG9ydCBjb25zdCBPcHBvcnR1bml0eUF0dHJpYnV0ZXMgPSB7XHJcbiAgTmFtZTogXCJuYW1lXCIsXHJcbiAgRXN0aW1hdGVkVmFsdWU6IFwiZXN0aW1hdGVkdmFsdWVcIixcclxuICBDdXN0b21lcklkOiBcImN1c3RvbWVyaWRcIixcclxuICAvLyBBZGQgbW9yZSBhcyBuZWVkZWRcclxufSBhcyBjb25zdDtcclxuXHJcbi8vIFR5cGUgaGVscGVycyBmb3IgYXV0b2NvbXBsZXRlIGFuZCB0eXBlIHNhZmV0eVxyXG5leHBvcnQgdHlwZSBBY2NvdW50QXR0cmlidXRlS2V5ID0ga2V5b2YgdHlwZW9mIEFjY291bnRBdHRyaWJ1dGVzO1xyXG5leHBvcnQgdHlwZSBDb250YWN0QXR0cmlidXRlS2V5ID0ga2V5b2YgdHlwZW9mIENvbnRhY3RBdHRyaWJ1dGVzO1xyXG5leHBvcnQgdHlwZSBPcHBvcnR1bml0eUF0dHJpYnV0ZUtleSA9IGtleW9mIHR5cGVvZiBPcHBvcnR1bml0eUF0dHJpYnV0ZXM7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/constants/EntityAttributes.ts\n\n}");

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
/******/ 			// no module.id needed
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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/Forms/ContactForm.ts");
/******/ 	cds = __webpack_exports__;
/******/ 	
/******/ })()
;