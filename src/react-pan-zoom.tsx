/*
  Heavily inspired/lifted from this idea: https://stackoverflow.com/a/39311435/661768
  without jqueryUI or jquery dependency.
*/
import * as React from 'react';

export interface IDragData {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface IReactPanZoomStateType {
  dragging: boolean;
  dragData: IDragData;
  matrixData: number[];
}
export interface IReactPanZoomProps {
  height?: string;
  width?: string;
  className?: string;
  enablePan?: boolean;
  zoom?: number;
  pandx?: number;
  pandy?: number;
  onPan?: (x: number, y: number, event: React.MouseEvent<EventTarget>) => void;
}
export default class ReactPanZoom extends React.PureComponent<
  IReactPanZoomProps,
  IReactPanZoomStateType
> {
  // In strict null checking setting default props doesn't seem to work. Hence the non-null assertion.
  // :crossedfingers: it shouldn't be deprecated. Or the very least support defaultProps semantics as proposed
  // in this PR: https://github.com/Microsoft/TypeScript/issues/23812
  public static defaultProps: Partial<IReactPanZoomProps> = {
    enablePan: true,
    onPan: () => undefined,
    pandx: 0,
    pandy: 0,
    zoom: 1,
  };
  private getInitialState = () => {
    const { pandx, pandy, zoom } = this.props;
    const defaultDragData = {
      dx: pandx!,
      dy: pandy!,
      x: 0,
      y: 0,
    };
    return {
      dragData: defaultDragData,
      dragging: false,
      matrixData: [
        zoom!,
        0,
        0,
        zoom!,
        pandx!,
        pandy!, // [zoom, skew, skew, zoom, dx, dy]
      ],
    };
  };
  // Used to set cursor while moving.
  private panWrapper: any;
  // Used to set transform for pan.
  private panContainer: any;
  public state = this.getInitialState();

  private onMouseDown = (e: React.MouseEvent<EventTarget>) => {
    if (!this.props.enablePan) {
      return;
    }
    const { matrixData, dragData } = this.state;
    const offsetX = matrixData[4];
    const offsetY = matrixData[5];
    const newDragData: IDragData = {
      dx: offsetX,
      dy: offsetY,
      x: e.pageX,
      y: e.pageY,
    };
    this.setState({
      dragData: newDragData,
      dragging: true,
    });
    if (this.panWrapper) {
      this.panWrapper.style.cursor = 'move';
    }
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    e.preventDefault();
  };

  public componentWillReceiveProps(nextProps: IReactPanZoomProps) {
    const { matrixData } = this.state;
    const { zoom = matrixData[0], pandx = matrixData[4], pandy = matrixData[5] } = nextProps;
    const newMatrixData = [...this.state.matrixData];
    if (matrixData[0] !== zoom) {
      newMatrixData[0] = zoom || newMatrixData[0];
      newMatrixData[3] = zoom || newMatrixData[3];
    }
    if (matrixData[4] !== pandx) {
      newMatrixData[4] = pandx;
    }
    if (matrixData[5] !== pandy) {
      newMatrixData[5] = pandy;
    }
    this.setState({
      matrixData: newMatrixData,
    });
  }

  private onMouseUp = (event: React.MouseEvent<EventTarget>) => {
    this.setState({
      dragging: false,
    });
    if (this.panWrapper) {
      this.panWrapper.style.cursor = '';
    }
    if (this.props.onPan && this.props.enablePan) {
      this.props.onPan(this.state.matrixData[4], this.state.matrixData[5], event);
    }
  };

  private getNewMatrixData = (x: number, y: number): number[] => {
    const { dragData, matrixData } = this.state;
    const deltaX = dragData.x - x;
    const deltaY = dragData.y - y;
    matrixData[4] = dragData.dx - deltaX;
    matrixData[5] = dragData.dy - deltaY;
    return matrixData;
  };

  private onMouseMove = (e: React.MouseEvent<EventTarget>) => {
    if (this.state.dragging) {
      const matrixData = this.getNewMatrixData(e.pageX, e.pageY);
      this.setState({
        matrixData,
      });
      if (this.panContainer) {
        this.panContainer.style.transform = `matrix(${this.state.matrixData.toString()})`;
      }
    }
  };

  public render() {
    return (
      <div
        className={`pan-container ${this.props.className || ''}`}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        style={{
          height: this.props.height,
          userSelect: 'none',
          width: this.props.width,
        }}
        ref={(ref) => (this.panWrapper = ref)}
      >
        <div
          ref={(ref) => (ref ? (this.panContainer = ref) : null)}
          style={{
            transform: `matrix(${this.state.matrixData.toString()})`,
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
