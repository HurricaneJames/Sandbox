// Components
var React = require('react');
var Container = require('./components/container.jsx');
var Item = require('./components/item.jsx');

var randomItemNames = ["apple", "bannana", "watermelon", "chocolate", "ice cream"]
  , defaultProps = {
  items: randomItemNames.map(function(name) { return React.createElement(Item, { name: name }); })
};

React.render(React.createElement(Container, defaultProps), document.querySelector('#container'));