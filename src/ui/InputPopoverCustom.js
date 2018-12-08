/* @flow */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import IconButton from './IconButton';
import ButtonGroup from './ButtonGroup';
import autobind from 'class-autobind';
import cx from 'classnames';

import styles from './InputPopover.css';

type Props = {
  className?: string;
  defaultValue?: Object;
  onCancel: () => any;
  onSubmit: (value: Object) => any;
};

export default class InputPopoverCustom extends Component {
  props: Props;
  _inputRef: ?Object;

  constructor() {
    super(...arguments);
    autobind(this);
    this.state = {url:this.props.defaultValue.url, class:this.props.defaultValue.class, target:this.props.defaultValue.target};
    this._inputRef = {url:this.props.defaultValue.url, class:this.props.defaultValue.class, target:this.props.defaultValue.target};
  }

  componentDidMount() {
    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onDocumentKeydown);
    if (this._inputRef && this._inputRef.url) {
      this._inputRef.url.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._onDocumentClick);
    document.removeEventListener('keydown', this._onDocumentKeydown);
  }

  render() {
    let {props} = this;
    let className = cx(props.className, styles.root);

    return (
      <div className={className}>
        <div className={styles.innerVertical}>
        <div>
          <label>Link: </label>
          <input
            ref={this._setInputRefUrl}
            defaultValue={props.defaultValue.url}
            type="text"
            placeholder="https://example.com/"
            className={styles.input}
            onKeyPress={this._onInputKeyPress}
          />
        </div>
          
          <div>
          <label>Class: </label>
          <input
            ref={this._setInputRefClass}
            defaultValue={(props.defaultValue.title)?props.defaultValue.title:props.defaultValue.class}
            type="text"
            placeholder="class name"
            className={styles.input}
            onKeyPress={this._onInputKeyPress}
          />
        </div>
           
        <div>
          <label>Target: </label>
          <select ref={this._setInputRefTarget} id="target-select" className={styles.select} value={this.state.target} onChange={this._onChangeTarget}>
            {this._renderTarget()}
          </select>
        </div>
           
          <ButtonGroup className={styles.buttonGroup}>
            <IconButton
              label="Cancel"
              iconName="cancel"
              onClick={props.onCancel}
            />
            <IconButton
              label="Submit"
              iconName="accept"
              onClick={this._onSubmit}
            />
          </ButtonGroup>
        </div>
      </div>
    );
  }

  _setInputRefUrl(inputElement: Object) {
    this._inputRef.url = inputElement 
  }

  _setInputRefClass(inputElement: Object) {
    this._inputRef.class = inputElement;
  }

  _setInputRefTarget(inputElement: Object) {
    this._inputRef.target = inputElement;
  }

  _onChangeTarget(event){
    this.setState({ "target": event.target.value });
    this.props.defaultValue.target = event.target.value;
    this._inputRef.target.value = event.target.value;
    }

  _renderTarget(){
    let result = ["_blank", "_self", "_parent", "_top"];
    let options = [];
    for (let k = 0; k < result.length; k++) {
      options.push(<option key={result[k]} value={result[k]} > {result[k]} </option>);
    }
    return options;
  }

  _onInputKeyPress(event: Object) {
    if (event.which === 13) {
      // Avoid submitting a <form> somewhere up the element tree.
      event.preventDefault();
      this._onSubmit();
    }
  }

  _onSubmit() {
    let urlObj  = {
        url: this._inputRef.url ? this._inputRef.url.value : '', 
        class: this._inputRef.class ? this._inputRef.class.value : '', 
        target: this._inputRef.target ? this._inputRef.target.value : '_blank'
      };
    this.props.onSubmit(urlObj);
  }

  _onDocumentClick(event: Object) {
    let rootNode = ReactDOM.findDOMNode(this);
    if (!rootNode.contains(event.target)) {
      // Here we pass the event so the parent can manage focus.
      this.props.onCancel(event);
    }
  }

  _onDocumentKeydown(event: Object) {
    if (event.keyCode === 27) {
      this.props.onCancel();
    }
  }
}
