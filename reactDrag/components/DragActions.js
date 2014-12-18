var Reflux = require('reflux');

var dragActions = Reflux.createActions([
  "dragStart",
  "dragOver",
  "dragEnd"
]);

module.exports = dragActions;