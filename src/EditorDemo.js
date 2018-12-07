/* @flow */
import React, {Component} from 'react';
import RichTextEditor, {createEmptyValue, createValueFromString} from './RichTextEditor';
import {convertToRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import autobind from 'class-autobind';

import ButtonGroup from './ui/ButtonGroup';
import Dropdown from './ui/Dropdown';
import IconButton from './ui/IconButton';

import type {EditorValue} from './RichTextEditor';

type Props = {};
type State = {
  value: EditorValue;
  format: string;
  readOnly: boolean;
};

export default class EditorDemo extends Component {
  props: Props;
  state: State;

  constructor() {
    super(...arguments);
    autobind(this);
    let dummytext = '<h1>Hello World!</h1><p>Lorem ipsum text paragraph with <a href="http://www.github.com" class="event_class"  target="_blank" title="event_class">link</a> and another <a href="http://www.twitter.com" class="event_social" target="_self" title="event_social">link</a></p>';
    this.state = {
      value: createValueFromString(dummytext, "html"),
      format: 'html',
      readOnly: false,
    };
  }

  render() {
    let {value, format} = this.state;

    //this.setState({value : "an empty text" });

    return (
      <div className="editor-demo">
        <div className="row">
          <p>This is a demo of the <a href="https://github.com/sstur/react-rte" target="top">react-rte</a> editor.</p>
        </div>
        <div className="row">
          <RichTextEditor
            value={value}
            onChange={this._onChange}
            className="react-rte-demo"
            placeholder="Tell a story"
            toolbarClassName="demo-toolbar"
            editorClassName="demo-editor"
            readOnly={this.state.readOnly}
            // customControls={[
            //   // eslint-disable-next-line no-unused-vars
            //   (setValue, getValue, editorState) => {
            //     let choices = new Map([
            //       ['1', {label: '1'}],
            //       ['2', {label: '2'}],
            //       ['3', {label: '3'}],
            //     ]);
            //     return (
            //       <ButtonGroup key={1}>
            //         <Dropdown
            //           choices={choices}
            //           selectedKey={getValue('my-control-name')}
            //           onChange={(value) => setValue('my-control-name', value)}
            //         />
            //       </ButtonGroup>
            //     );
            //   },
            //   <ButtonGroup key={2}>
            //     <IconButton
            //       label="Remove Link"
            //       iconName="remove-link"
            //       focusOnClick={false}
            //       onClick={() => console.log('You pressed a button')}
            //     />
            //   </ButtonGroup>,
            // ]}
          />
        </div>
        {/* <div className="row">
          <label className="radio-item">
            <input
              type="radio"
              name="format"
              value="html"
              checked={format === 'html'}
              onChange={this._onChangeFormat}
            />
            <span>HTML</span>
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="format"
              value="markdown"
              checked={format === 'markdown'}
              onChange={this._onChangeFormat}
            />
            <span>Markdown</span>
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="format"
              value="raw"
              checked={format === 'raw'}
              onChange={this._onChangeFormat}
            />
            <span>Raw</span>
          </label>
          <label className="radio-item">
            <input
              type="checkbox"
              onChange={this._onChangeReadOnly}
              checked={this.state.readOnly}
            />
            <span>Editor is read-only</span>
          </label>
        </div> */}
        
        {/* <div className="row">
          <textarea
            className="source"
            placeholder="Editor Source"
            value={value.toString(format, "inlineStyles")}
            onChange={this._onChangeSource}
          />
        </div> */}
        <div className="row btn-row">
          <span className="label">Debugging:</span>
          {/* <button className="btn" onClick={this._logState}>Log Content State</button>
          <button className="btn" onClick={this._logStateRaw}>Log Raw</button> */}
          <button className="btn" onClick={this.onClickLogToConsoleButton}>Log to Console</button>
        </div>
      </div>
    );
  }

  // _logState() {
  //   let editorState = this.state.value.getEditorState();
  //   let contentState = window.contentState = editorState.getCurrentContent().toJS();
  //   console.log(contentState);
  // }

  // _logStateRaw() {
  //   let editorState = this.state.value.getEditorState();
  //   let contentState = editorState.getCurrentContent();
  //   let rawContentState = window.rawContentState = convertToRaw(contentState);
  //   console.log(JSON.stringify(rawContentState));
  // }

  onClickLogToConsoleButton = () => {
    //
    // var myDiv = document.getElementsByClassName("public-DraftStyleDefault-block");
    // var spans = myDiv[0].getElementsByTagName("span");   

    // for(var i=0; i<spans.length;i++){
    //   var text = spans[i].innerHTML;
    //   myDiv.innerHTML += text;
    //   myDiv.removeChild(spans[i]);
    // }

    // console.log(myDiv.innerHTML);

    let options = {
      entityStyleFn: (entity) => {
        const entityType = entity.get('type').toLowerCase();
        if (entityType === 'link') {
          const data = entity.getData();
          //console.log("retrans data:", data)
          let gaClass = (data.title)?data.title:data.class;
          return {
            element: 'a',
            attributes: {
              href: data.url,
              class: gaClass,
              target: data.target
            },
          };
        }
      },
    };

    let editorState = this.state.value.getEditorState();
    let contentState = editorState.getCurrentContent();

    let html = stateToHTML(contentState, options);
    console.log("HTML: ", html)
  };


  _onChange(value: EditorValue) {
    this.setState({value});
  }

  // _onChangeSource(event: Object) {
  //   let source = event.target.value;
  //   let oldValue = this.state.value;
  //   this.setState({
  //     value: oldValue.setContentFromString(source, this.state.format),
  //   });
  // }

  // _onChangeFormat(event: Object) {
  //   this.setState({format: event.target.value});
  // }

  // _onChangeReadOnly(event: Object) {
  //   this.setState({readOnly: event.target.checked});
  // }
}
