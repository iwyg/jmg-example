import React, {PropTypes} from 'react';
import Figure from './Image.jsx';

const renderFigure = (props) => {
  let {images, ...rest} = props;
  return images.map((image, key) => {
    let {height, width} = image;
    return (
      <Figure
        key={key}
        src={image.uri}
        width={image.width}
        height={image.height}
        {...rest}
      />
    );
  });
};

/* image grid */
export default class Grid extends React.Component {

  //componentDidUpdate() {
  //  console.log('grid update', arguments);
  //}

  render() {
    return (
      <div className="grid"> { renderFigure(this.props) } </div>
    );
  }
}

Grid.propTypes = {
  images: PropTypes.array.isRequired
};
