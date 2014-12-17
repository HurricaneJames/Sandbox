var React = require('react');
var Item = require('./item.jsx');

// TODO - make this a require or a prop...
var styles = {
  container: {
    maxWidth: 550,
    background: '#cdc',
    border: '1px solid #777',
    listStyle: 'none',
    margin: 0,
    padding: 2
  },
  item: {
    background: '#df90df',
    margin: 5,
    padding: 3
  }
}

var Container = React.createClass({ displayName: "Container",
  propTypes: {
    items: React.PropTypes.array
  },
  getDefaultProps: function() {
    return {
      items: []
    };
  },
  render: function() {
    var items = this.props.items.map(function(item, index) {
      return <li key={index} style={styles.item}>{item}</li>;
    })
    return <ul style={styles.container}>{items}</ul>;
  }
});

module.exports = Container;