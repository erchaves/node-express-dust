import {h, render, Component} from 'preact';
import Preactor from '../preactor';

export default class Clock extends Preactor {
  constructor() {
    super();
    // set initial time:
    this.state.time = Date.now();
  }

  componentDidMount() {
    // update time every second
    this.timer = setInterval(() => {
      this.setState({ time: Date.now() });
    }, 1000);
  }

  componentWillUnmount() {
    // stop when not renderable
    clearInterval(this.timer);
  }

  render(props, state) {
    let time = new Date(state.time).toLocaleTimeString();

    return (
      <div className="component-preact-clock">
        <h2>
          Demo of preact component: Live updating clock
        </h2>
        <div className="clock-time deep-orange lighten-3">
          { time }
        </div>
      </div>
    )
  }
}
