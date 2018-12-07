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
    // console.log("initial _inputRef:", this._inputRef);
    // console.log("inputpopovercustom defaultValue", this.props.defaultValue);
    this._inputRef = {url:"a", class:"b", target:"c"};
  }

  componentDidMount() {
    document.addEventListener('click', this._onDocumentClick);
    document.addEventListener('keydown', this._onDocumentKeydown);
    if (this._inputRef) {
      //this._inputRef.url.focus();
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
          <input
            ref={this._setInputRefUrl}
            defaultValue={props.defaultValue.url}
            type="text"
            placeholder="https://example.com/"
            className={styles.input}
            onKeyPress={this._onInputKeyPress}
          />
           <input
            ref={this._setInputRefClass}
            defaultValue={(props.defaultValue.title)?props.defaultValue.title:props.defaultValue.class}
            type="text"
            placeholder="class name"
            className={styles.input}
            onKeyPress={this._onInputKeyPress}
          />
           <input
            ref={this._setInputRefTarget}
            defaultValue={props.defaultValue.target}
            type="text"
            placeholder="target"
            className={styles.input}
            onKeyPress={this._onInputKeyPress}
          />
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

    // console.log("InputPopoverCustom urlObj on submit: ", urlObj)
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
