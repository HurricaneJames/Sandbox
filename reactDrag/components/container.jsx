var React       = require('react')
  , Item        = require('./item.jsx');

var DRAG_DROP_CONTENT_TYPE = "custom_container_type"
  , HOVER_KEY = -1
  , NO_HOVER  = -1;

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
  getInitialState: function() {
    return {
      items: this.props.items,
      selected:  -1,
      hoverOver: -1
    };
  },
  containerAcceptsDropData: function(transferTypes) {
    // allow drag between custom containers (note: eventually will need to implement something based on the items themselves)
    return Array.prototype.indexOf.call(transferTypes, DRAG_DROP_CONTENT_TYPE) !== -1;
  },
  onDragStart: function(e) {
    var selectedIndex = parseInt(e.currentTarget.dataset.key);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(DRAG_DROP_CONTENT_TYPE, this.state.items[selectedIndex]);

    this.setState({ selected: selectedIndex, hoverOver: selectedIndex });
  },
  onDragOver: function(e) {
    if(!this.containerAcceptsDropData(event.dataTransfer.types)) { return; }
    e.preventDefault(); // allow drop

    var over = parseInt(e.currentTarget.dataset.key);
    if(over !== HOVER_KEY) { this.setState({ hoverOver: (over === this.state.selected) ? NO_HOVER : over })}
  },
  onDragEnd: function(e) {
    if(this.state.hoverOver === NO_HOVER) { return; }
    this.state.items.splice(this.state.hoverOver, 0, this.state.items.splice(this.state.selected, 1)[0]);
    this.state.hoverOver = NO_HOVER;
    this.setState(this.state);
  },
  injectHoverPlaceholder: function(items) {
    if(this.state.hoverOver != NO_HOVER) {
      items.splice(this.state.hoverOver + 1, 0, <li key={HOVER_KEY} style={styles.item}>Placeholder</li>);
    }
  },
  render: function() {
    var _this = this, items = this.state.items.map(function(item, index) {
      return <li key={index}
                data-key={index}
                style={styles.item}
                onClick={_this.onClick}
                draggable={true}
                onDragStart={_this.onDragStart}
                onDragOver={_this.onDragOver}
                onDragEnd={_this.onDragEnd}>{item}</li>;
    });

    this.injectHoverPlaceholder(items);

    return <ul style={styles.container}>{items}</ul>;
  }
});

module.exports = Container;