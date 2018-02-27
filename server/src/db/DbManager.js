'use strict';

const { Pool } = require('pg');
const connectionString = 'postgresql://postgres:root@localhost:5432/webdev';
const pool = new Pool({ connectionString: connectionString });

var logger = require('../utils/LogFactory').getLogger();

exports.getDbPool = function getDbPool() {

    return pool;
}

function buildSelectQuery(tableName) {
    return ['SELECT * FROM', tableName].join(' ');
}

function buildSelectQueryWithId(tableName) {
    return ['SELECT * FROM', tableName, 'WHERE id = $1'].join(' ');
}

function buildSelectQueryKey(tableName, key) {
    return ['SELECT * FROM', tableName, "WHERE", key, "= $1"].join(' ');
}

exports.selectAll = function(tableName) {

    const sql = buildSelectQuery(tableName);
    logQuery(sql);

    try {
        return pool.query(sql);

    } catch(err) {
        logger.error(err.stack);
        return new Error(err.toString());
    }
}


exports.selectById = function( tableName, id ) {

    const sql = buildSelectQueryWithId(tableName);
    logQuery(sql);

    try {
        return pool.query(sql, [ id ]);

    } catch(err) {
        logger.error(err.stack);
        return new Error(err.toString());
    }
}


exports.selectByKey = function( tableName, key, value ) {

    const sql = buildSelectQueryKey(tableName, key);
    logQuery(sql);

    try {
        return pool.query(sql, [ value ]);

    } catch(err) {
        logger.error(err.stack);
        return new Error(err.toString());
    }
}

function logQuery( sql ) {
    logger.info(['[DB]', sql].join(' '));
}
