var Reflux = require('reflux');
var DataTransferActions = require('./DataTransferActions');

var dataTransferStore = Reflux.createStore({
  listenables: [DataTransferActions],
  stageItemForTransfer: function(){}
});

module.exports = dataTransferStore;