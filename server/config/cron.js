/***********************************************************************************************************************
 *
 * CRON SERVER CONFIG
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
module.exports = {
    // for bulkWrite operations, the number of updates in a single batch sent to Mongo.
    bulkWrites: 100
};
