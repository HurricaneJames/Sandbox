// Components
var React = require('react');
var Container = require('./components/container.jsx');
var Item = require('./components/item.jsx');

var randomWords = [
  ["apple", "bannana", "watermelon", "oranges", "ice cream"],
  ["alpha", "beta", "gamma", "iota"],
  ["hot dog", "mustard", "guava"],
  ["chocolate", "ice cream", "cookies", "brownies"],
  ["dog", "cat", "iguana", "leopard", "bear"]
];

for(var i=1, length=randomWords.length; i<=length; i++) {
  var defaultProps = {
    storeId: "container-" + i,
    items: randomWords[i-1].map(function(name) { return React.createElement(Item, { name: name }); })
  };
  React.render(React.createElement(Container, defaultProps), document.querySelector('#container' + i));
}
