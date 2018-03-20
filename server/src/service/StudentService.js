'use strict';

var dbPool = require('../db/DbManager');
var logger = require('../utils/LogFactory').getLogger();

var Student = require('../models/student');

/**
 * Add a new student
 * 
 *
 * student Student Student object that shall be added
 * returns Student
 **/
exports.addStudent = function(student) {
  return new Promise(function(resolve, reject) {

      // check, if username is free
      dbPool.selectByKey( 'student', 'username', student.username)
          .then( res => {
              if( res.rowCount > 0 ) {

                  resolve( buildStudent( res.rows[0] ));

              } else {

                  // insert new username
                  const insertQuery = 'INSERT INTO student (username) VALUES ($1) RETURNING studentid, username';
                  const pool = dbPool.getDbPool();
                  logger.debug('[DB] ' + insertQuery);

                  pool.query(insertQuery, [ student.username ],
                      (err, result) => {
                          if( err ) {

                              reject(err);

                          } else {

                              if( result.rowCount > 0 ) {
                                  resolve(buildStudent( result.rows[0] ));
                              } else {
                                  resolve(undefined);
                              }
                          }
                      });
              }
          })
          .catch(err => {
              reject(err);
          });
  });
}


/**
 * Find student by studentID
 * Returns a single student
 *
 * studentID Long studentID of user to return
 * returns Student
 **/
exports.getStudentByStudentID = function(studentID) {
  return new Promise(function(resolve, reject) {

      dbPool.selectByKey( 'student', 'studentid', studentID)
          .then( res => {

              if( res.rowCount > 0 ) {
                  resolve(buildStudent( res.rows[0] ));
              } else {
                  reject('Invalid studentID');
              }
          })
          .catch(err => {
              reject(err);
          });
  });
}


/**
 * Returns all students in the system
 *
 * returns List
 **/
exports.getStudents = function() {
  return new Promise(function(resolve, reject) {

    dbPool.selectAll('student')
        .then( res => {

            var result = [];
            res.rows.forEach( function (item) {
                result.push( buildStudent(item) );
            });
            resolve(result);
        })
        .catch(err => {
            reject(err);
        });
  });
}


function buildStudent( row ) {
    return new Student(row.studentid, row.username);
}