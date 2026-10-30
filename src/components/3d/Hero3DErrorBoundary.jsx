import React from 'react';
import HeroPosterFallback from './HeroPosterFallback';

export default class Hero3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('[Hero3DErrorBoundary] Caught 3D WebGL runtime error, falling back to static poster:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <HeroPosterFallback isDark={this.props.isDark} />;
    }
    return this.props.children;
  }
}
