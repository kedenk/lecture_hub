'use strict';

var dbPool = require('../db/DbManager');

/**
 * Returns all lectures in the system
 *
 * returns List
 **/
exports.getLectures = function() {
  return new Promise(function(resolve, reject) {

      dbPool.selectAll('lecture')
          .then( res => {
              console.log(res.rows);
              resolve(res.rows);
          })
          .catch(err => {
              reject(err);
          });
  });
}
