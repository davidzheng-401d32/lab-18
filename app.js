'use strict';

const fs = require('fs');

const io = require('socket.io-client');
const client = io.connect('http://localhost:3001');

// let num = 0;
// setInterval(() => {
//   client.emit('speak', num++ );
// }, 500);

let file = process.argv.slice(2).shift();

const util = require('util');
const fsRead = util.promisify(fs.readFile);
const fsWrite = util.promisify(fs.writeFile);

/**
 * Function that reads the file.
 * @param {filepath}
 * @return {buffer}
 */
const readFile = (filePath) => fsRead(filePath);

/**
 * Function that writes and saves the file.
 * @param {filepath}
 * @param {buffer}
 */
const writeFile = (filePath, buffer) => fsWrite(filePath, buffer);

/**
 * Function that turns contents into uppercase. 
 * @param {buffer}
 * @return {buffer}
 */
const upperCase = (buffer) => {
  const convertedBuffer = buffer.toString().trim().toUpperCase();
  return Buffer.from(convertedBuffer);
};

const events = {
  READ_ERROR: 'read_error',
  WRITE_ERROR: 'write_error',
  WRITE_SUCCESS: 'write_success',
};

/**
 * This function combines the readFile, upperCase, and writeFile Function.
 * @param {path}
 *
 */
const alterFile = (path) => {
  return readFile(path)
    .then(contents => upperCase(contents))
    .then(buffer => {
      return writeFile(path, buffer)
        .catch(e => client.emit(`${events.WRITE_ERROR} ${e}`));
    })
    .then(() => client.emit(`${events.WRITE_SUCCESS} ${path}`))
    .catch(e => client.emit(`${events.READ_ERROR} ${e.text}`));
};


alterFile(file);






