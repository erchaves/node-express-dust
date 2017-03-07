import {h, render, Component} from 'preact';
import Preactor from '../preactor';

export default class Clock extends Preactor {
  constructor() {
    super();
    // set initial time:
    this.state.time = Date.now();
  }

  postInit() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  preDestroy() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render(props, state) {
    let time = new Date(state.time).toLocaleTimeString();
    return <span>{ time }</span>;
  }
}
