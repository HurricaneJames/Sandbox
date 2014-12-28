var React       = require('react')
  , Item        = require('./item.jsx')
  , merge       = require('./merge');

var DRAG_DROP_CONTENT_TYPE = "custom_container_type"
  , ALLOWED_DROP_EFFECT = "move"
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
    margin: 3,
    padding: 3
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
    e.dataTransfer.effectAllowed = ALLOWED_DROP_EFFECT;
    e.dataTransfer.setData(DRAG_DROP_CONTENT_TYPE, this.state.items[selectedIndex]);

    this.setState({ selected: selectedIndex });
  },
  onDragEnd: function(e) {
    if(e.dataTransfer.dropEffect === ALLOWED_DROP_EFFECT) {
      this.state.items.splice(this.state.selected, 1);
      this.setState(this.state);
    }
  },
  onDrop: function(e) {
    var data   = e.dataTransfer.getData(DRAG_DROP_CONTENT_TYPE);
    if(this.state.hoverOver !== NO_HOVER) {
      this.state.items.splice(this.state.hoverOver, 0, data);
      this.state.hoverOver = NO_HOVER;
      this.setState(this.state);
    }
  },
  onDragOverDropZone: function(e) {
    if(this.containerAcceptsDropData(e.dataTransfer.types)) { e.preventDefault(); } 
  },
  onDragEnterDropZone: function(e) {
    var over = parseInt(e.currentTarget.dataset.key);
    if(over !== this.state.hoverOver) { this.setState({ hoverOver: over }); }    
  },
  onDragLeaveDropZone: function(e) {
    this.setState({ hoverOver: NO_HOVER });
  },
  renderDropZone: function(index) {
    return <li key={"dropzone-" + index}
               data-key={index}
               style={merge(
                styles.dropZone,
                this.state.hoverOver === index && styles.activeDropZone
               )}
               onDragEnter={this.onDragEnterDropZone}
               onDragLeave={this.onDragLeaveDropZone}
               onDragOver={this.onDragOverDropZone}
               onDrop={this.onDrop}></li>;
  },
  renderListElements: function() {
    var items = [];
    for(var i=0, length=this.state.items.length;i<length;i++) {
      items.push(this.renderDropZone(i));
      items.push(this.renderListElement(React.createElement(this.props.itemTemplate, { item: this.state.items[i] }), i));
    }
    items.push(this.renderDropZone(i));
    return items;
  },
  renderListElement: function(item, key) {
    return(
      <li key={key}
          data-key={key}
          style={styles.item}
          onClick={this.onClick}
          draggable  ={true}
          onDragStart={this.onDragStart}
          onDragEnd  ={this.onDragEnd}>{item}</li>
    );
  },
  render: function() {
    var items = this.renderListElements();
    return (
      <ul ref="container"
          style={styles.container}>{items}</ul>
    );
  }
});

module.exports = Container;