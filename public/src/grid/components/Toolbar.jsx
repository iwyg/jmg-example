export const ToolGroup = ({children}) => {
  return (<div className="tool-group">{children}</div>);
}

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {...props} = this.props;
    return (
      <div {...props}>{this.props.children}</div>
    );
  }
}
