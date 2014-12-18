var Reflux = require('reflux');

var DataTransferActions = Reflux.createActions([
  "stageItemForTransfer"
  "transferItemsFromStage",
  "removeItemFromStage",
  "removeAllItemsFromStage"
]);

module.exports = dragActions;