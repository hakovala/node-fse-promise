# fse-promise

Promisified version of Node fs and fs-extra that preserves callbacks.

[![NPM version](https://img.shields.io/npm/v/fse-promise.svg)](https://www.npmjs.com/package/fse-promise)

## Install

```
npm install fse-promise
```

## Usage

Drop-in replacement for [Node fs](https://nodejs.org/api/fs.html) and [fs-extra](https://www.npmjs.com/packages/fs-extra) module.

All Node `fs` and `fs-extra` asynchronous methods are wrapped so that
they return a promise if callback is not provided.
If callback is defined then the method works as defined in `fs` and
`fs-extra`.

Check `index.js` for list of supported methods.
If you notice any missing methods in that list, add it and create PR to get it added.

Example usage:
```js
const fs = require('fse-promise');

// using callbacks
fs.readFile(filepath, (err, data) => {
	if (err) return console.error(err);
	console.log(data);

	fs.outputFile(filepath, (err, data => {
		if (err) return console.error(err);
		console.log('saved');
	}));
});

// using promises
fs.readFile(filepath)
	.then((data) => {
		console.log(data);

		return fs.outputFile(filepath);
	})
	.then(() => {
		console.log('saved');
	})
	.catch((err) => {
		console.error(err);
	});

```
