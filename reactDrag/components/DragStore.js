var Reflux = require('reflux');
var DragActions = require('./DragActions');

var dragStore = Reflux.createStore({
  listenables: [DragActions],
  onDragStart: function(e) {
    console.debug("Drag Start: %o", e);
    console.debug("    Target : %o", e.target);
    console.debug("    Current: %o", e.currentTarget);
    console.debug("    Related: %o", e.relatedTarget);
  },
  onDragEnd:   function(e) { console.debug("Drag End"); },
  onDragOver:  function(e) { console.debug("Drag Over"); }
});

module.exports = dragStore;