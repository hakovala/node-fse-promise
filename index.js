"use strict";

var fse = require('fs-extra');

var fsp = {};

// attach fs-extra methods to fsp
Object.keys(fse).forEach((key) => {
	fsp[key] = fse[key];
});

// list of methods to modify
const METHODS = [
	// fs-extra methods
	'copy',
	'emptyDir',
	'ensureFile',
	'ensureDir',
	'ensureLink',
	'ensureSymlink',
	'mkdirs',
	'move',
	'outputFile',
	'outputJson',
	'readJson',
	'remove',
	'writeJson',
	// node fs methods
	'access',
	'appendFile',
	'chmod',
	'chown',
	'close',
	'exists', // NOTE: this is a special case, and also deprecated in latest Node.js
	'fchmod',
	'fchown',
	'fdatasync',
	'fstat',
	'fsync',
	'ftruncate',
	'futimes',
	'lchmod',
	'lchown',
	'link',
	'lstat',
	'mkdir',
	'open',
	'read',
	'readdir',
	'readFile',
	'readlink',
	'realpath',
	'rename',
	'rmdir',
	'stat',
	'symlink',
	'truncate',
	'unlink',
	'utimes',
	'write',
	'write',
	'writeFile',
];

/**
 * Check if argument list contains callback function
 */
function hasCallback(args) {
	return typeof args[args.length - 1] === 'function';
}

/**
 * Call method with callback function
 */
function callCallback(fn, args) {
	return fn.apply(null, args);
}

/**
 * Call method with promises
 */
function callPromise(fn, args) {
	return new Promise((resolve, reject) => {
		// promisified callback
		function callback(err,other) {
			// check if the 'err' is boolean, if so then this is a 'exists' callback special case
			if (err && !(typeof err === 'boolean')) return reject(err);
			// convert arguments to proper array
			let args = Array.prototype.slice.call(arguments);
			// if arguments length is one or more resolve arguments as array,
			// otherwise resolve the argument as is.
			return resolve(args.length < 2 ? args[0] : args.slice(1));
		}
		fn.apply(null, args.concat([callback]));
	});
}

/**
 * Wrap method to handle both callbacks and promises
 */
function makePromise(fn) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		if (hasCallback(args)) {
			// argument list has callback, so call method with callback
			return callCallback(fn, args);
		} else {
			// no callback, call method with promises
			return callPromise(fn, args);
		}
	}
}

// promisify specified methods
for (let method of METHODS) {
	fsp[method] = makePromise(fse[method]);
}

module.exports = fsp;
