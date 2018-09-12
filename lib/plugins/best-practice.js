"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bestPractice = bestPractice;

function bestPractice() {
  return function ($) {
    $('[target="_blank"]').attr('rel', 'noopener');
  };
}