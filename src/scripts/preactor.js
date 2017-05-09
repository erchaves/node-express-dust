import {h, render, Component} from 'preact';

export default class Preactor extends Component {
  constructor() {
    super();
  }

  render() {
    console.log('test');
  }

  // proxy to a nicer syntax
  // componentWillMount --> preInit
  // componentDidMount --> postInit
  // componentWillReceiveProps --> preReady
  // shouldComponentUpdate --> shouldFreeze
  // componentWillUpdate --> preUpdate
  // componentDidUpdate --> postUpdate
  // componentWillUnmount --> preDestroy
  // componentDidUnmount --> postDestroy

  componentWillMount() {return this.preInit && this.preInit.apply(this, arguments);}
  componentDidMount() {return this.postInit && this.postInit.apply(this, arguments);}
  componentWillReceiveProps() {return this.preReady && this.preReady.apply(this, arguments);}
  shouldComponentUpdate() {return this.shouldFreeze && this.shouldFreeze.apply(this, arguments);}
  componentWillUpdate() {return this.preUpdate && this.preUpdate.apply(this, arguments);}
  componentDidUpdate() {return this.postUpdate && this.postUpdate.apply(this, arguments);}
  componentWillUnmount() {return this.preDestroy && this.preDestroy.apply(this, arguments);}
  componentDidUnmount() {return this.postDestroy && this.postDestroy.apply(this, arguments);}
}
