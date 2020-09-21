import React, {Component} from "react";

export interface ComponentInterface {
  default: Component;
}

/**
 * Optimization function meant for loading page chunks only when needed
 * This component may be useful in some point with big components
 * @param importComponent, component chunk to be loaded from server
 * @constructor
 * @return class component
 */
const AsyncComponent = (importComponent: any) => {
  return class extends Component<any, any> {
    state = {
      component: null
    }

    componentDidMount() {
      importComponent().then((cmp: ComponentInterface) => {
        this.setState({component: cmp.default})
      });
    }

    render() {
      const C = this.state.component;

      // Todo, find a way to fix this without using ts-ignore!
      // @ts-ignore
      return C ? <C {...this.props} /> : null;
    }
  }
}

export default AsyncComponent;
