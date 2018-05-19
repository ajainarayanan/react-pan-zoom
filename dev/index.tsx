import * as React from "react";
import * as ReactDOM from "react-dom";
import ReactPanZoom from "../src/react-pan-zoom";
import styled, {injectGlobal, css} from "styled-components";
import IconSVG from "./components/IconSVG";
import GlobalStyles from "./global-styles";

/* tslint:disable:no-unused-expression */
injectGlobal`${GlobalStyles}`;
/* tslint:enable:no-unused-expression */

const HEADER_HEIGHT = 50;
const Container = css`
  height: calc(100vh - ${HEADER_HEIGHT}px);
  width: 100vw;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
const ControlsContainer = styled.div`
  position: fixed;
  background: lightgray;
  height: 100%;
  right: 0;
  z-index: 2;
  cursor: pointer;
  user-select: none;

  > div {
    padding: 15px;
    &:hover {
      background: darkgray;
    }
    &:active {
      box-shadow: 1px 1px 1px inset;
    }
  }
`;

const Heading = styled.div`
  background: dimgrey;
  color: white;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

export default class ReactPanZoomDemo extends React.PureComponent {
  public state = {
    dx: 397,
    dy: -77,
    zoom: 1,
  };

  private zoomIn = () => {
    this.setState({
      zoom: this.state.zoom + 0.2,
    });
  };

  private zoomOut = () => {
    this.setState({
      zoom: this.state.zoom - 0.2,
    });
  };

  private onPan = (dx, dy) => {
    this.setState({
      dx,
      dy,
    });
  };

  public renderPanZoomControls = () => {
    return (
      <ControlsContainer>
        <div onClick={this.zoomIn}><IconSVG name="icon-zoom-in" /></div>
        <div onClick={this.zoomOut}><IconSVG name="icon-zoom-out" /></div>
      </ControlsContainer>
    );
  };

  public render() {
    const StyledReactPanZoom = styled(ReactPanZoom)`${Container}`;
    return[
      <Heading key="heading"> React Pan and Zoom </Heading>,
      this.renderPanZoomControls(),
      <StyledReactPanZoom
        zoom={this.state.zoom}
        pandx={this.state.dx}
        pandy={this.state.dy}
        onPan={this.onPan}
      >
        <img src="https://i.imgur.com/WJ17gs5.jpg" />
      </StyledReactPanZoom>,
    ];
  }
}

ReactDOM.render(<ReactPanZoomDemo />, document.getElementById("app-pan-and-zoom"));
