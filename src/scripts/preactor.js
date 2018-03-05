import {h, render, Component} from 'preact';

// a wrapper in case we need to extend functionality
export default class Preactor extends Component {
  constructor() {
    super();
  }

  render() {
    console.log('test');
  }
}
