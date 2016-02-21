import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import Src from './components/Image.jsx';

console.log(Src);

class Layout extends Component {
  constructor() {
    super();
    console.log(arguments);
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

ReactDOM.render(
  <Layout>
    <Src src="media/q/images/image_0001.jpg"/>
    <Src src="media/q/images/image_0002.jpg"/>
    <Src src="media/q/images/image_0003.jpg"/>
  </Layout>,
  document.getElementById('main')
);
