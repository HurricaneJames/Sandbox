var React       = require('react')
  , Item        = require('./item.jsx')
  , merge       = require('./merge');

var DRAG_DROP_CONTENT_TYPE = "custom_container_type"
  , ALLOWED_DROP_EFFECT = "move"
  , HOVER_KEY = -1
  , NO_HOVER  = -1
  , NONE_SELECTED = -1;

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
    backgroundColor: '#df90df',
    margin: 3,
    padding: 3
  },
  selectedItem: {
    backgroundColor: '#333'
  },
  dropZone: {
    height: 2,
    backgroundColor: 'transparent',
    transition: 'height 400ms'
  },
  activeDropZone: {
    height: 15,
    background: '#fff',
    transition: 'height 150ms'
  }
}

var TextTemplate = React.createClass({ displayName: "Container-TextTemplate",
  propTypes: {
    item: React.PropTypes.any.isRequired
  },
  render: function() {
    return <span>{this.props.item}</span>;
  }
});

var Container = React.createClass({ displayName: "Container",
  propTypes: {
    items: React.PropTypes.array,
    itemTemplate: React.PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      items: [],
      itemTemplate: TextTemplate
    };
  },
  getInitialState: function() {
    return {
      items: this.props.items,
      selected:  NONE_SELECTED,
      hoverOver: -1
    };
  },
  containerAcceptsDropData: function(transferTypes) {
    // allow drag between custom containers (note: eventually will need to implement something based on the items themselves)
    return Array.prototype.indexOf.call(transferTypes, DRAG_DROP_CONTENT_TYPE) !== -1;
  },
  onDragStart: function(e) {
    var selectedIndex = parseInt(e.currentTarget.dataset.key);
    e.dataTransfer.effectAllowed = ALLOWED_DROP_EFFECT;
    e.dataTransfer.setData(DRAG_DROP_CONTENT_TYPE, this.state.items[selectedIndex]);

    this.setState({ selected: selectedIndex });
  },
  onDragEnd: function(e) {
    if(e.dataTransfer.dropEffect === ALLOWED_DROP_EFFECT) {
      this.state.items.splice(this.state.selected, 1);
      this.state.hoverOver = NO_HOVER;
      this.state.selected = NONE_SELECTED;
      this.setState(this.state);
      return;
    }
    if(this.state.hoverOver !== NO_HOVER) {
      this.setState({ hoverOver: NO_HOVER, selected: NONE_SELECTED });
    }
  },
  onDrop: function(e) {
    var data   = e.dataTransfer.getData(DRAG_DROP_CONTENT_TYPE);
    // this needs some testing
    // presently, it appears that drop fires before dragend, so it is not a problem to clear HOVER_OVER
    // howver, it may necessary to add a setTimeout of a couple ms to clear the hoverOver element in the
    // onDragEnd function
    if(this.state.hoverOver !== NO_HOVER) {
      this.state.items.splice(this.state.hoverOver, 0, data);
      if(this.state.selected > this.state.hoverOver) {
        // we are adding above the item to be removed, fix the selected to point to the old item
        this.state.selected = this.state.selected+1;
      }
      this.state.hoverOver = NO_HOVER;

      this.setState(this.state);
    }
  },
  onDragOverItem: function(e) {
    if(this.containerAcceptsDropData(e.dataTransfer.types)) { e.preventDefault(); } 
    var to = parseInt(e.currentTarget.dataset.key);
    if(e.clientY - e.currentTarget.offsetTop > e.currentTarget.offsetHeight / 2) { to++; }
    if(to !== this.state.hoverOver) { this.setState({ hoverOver: to }); }
  },
  onDragOverDropZone: function(e) {
    if(this.containerAcceptsDropData(e.dataTransfer.types)) { e.preventDefault(); } 
  },
  resetHover: function(e) {
    console.debug("Reset Hover 2.0");
    if(this.state.hoverOver !== NO_HOVER) { console.debug("SAY WHAT"); this.setState({ hoverOver: NO_HOVER }); }
  },
  renderDropZone: function(index) {
    return <li key={"dropzone-" + index}
               data-key={index}
               style={merge(styles.dropZone, this.state.hoverOver === index && styles.activeDropZone)}
               onDragOver={this.onDragOverDropZone}></li>;
  },
  renderListElements: function() {
    var items = [];
    for(var i=0, length=this.state.items.length;i<length;i++) {
      items.push(this.renderDropZone(i));
      // TODO - see if there is a performance hit when recreating these elements
      //        if there is, create a cache of elements in the state when the items are updated
      items.push(this.renderListElement(React.createElement(this.props.itemTemplate, { item: this.state.items[i] }), i));
    }
    items.push(this.renderDropZone(i));
    return items;
  },
  renderListElement: function(item, key) {
    return(
      <li key={key}
          data-key={key}
          style={merge(styles.item, this.state.selected===key && styles.selectedItem )}
          onClick={this.onClick}
          draggable  ={true}
          onDragOver ={this.onDragOverItem}
          onDragStart={this.onDragStart}
          onDragEnd  ={this.onDragEnd}>{item}</li>
    );
  },
  render: function() {
    var items = this.renderListElements();
    return (
      <ul ref="container"
          onDrop={this.onDrop}
          style={styles.container}>{items}</ul>
    );
  }
});

module.exports = Container;