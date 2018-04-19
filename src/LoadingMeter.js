import React, { Component } from 'react'

class LoadingMeter extends Component {
  componentDidMount() {
    this.setState({ interval: setInterval(this.forceUpdate.bind(this), 20) });
  }

  render() {
    return (
      <div className="loading-meter">
        <div className="loading-meter-progress"
          style={{ width: Math.min((Date.now() - this.props.lastFireTime) / 70, 100) + '%' }} />
      </div>
    );
  }
}

export default LoadingMeter;
