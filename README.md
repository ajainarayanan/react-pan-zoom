# React Pan & Zoom

A simple pan and zoom for canvas like elements in react.

A demo can be found here - [React Pan Zoom]()

## Installation

```
> yarn add react-pan-zoom
```

## Usage

```typescript
import ReactPanZoom from "react-pan-zoom";
class MyComponent extends React.PureComponent {

  public render() {
    return (
      <ReactPanZoom>
        <img src="some/src/for/image.png" />
      </ReactPanZoom>
    );
  }
}
```

## Props

- `zoom` : Provide zoom level for the cavnas'ish element. `1` by default
- `dx` : Provide the initial x co-ordinate to pan the underlying element to be. `0` by default
- `dy` : Provide the initial y co-ordinate to pan the underlying element to be. `0` by default

For more information on what `dx` and `dy` mean please [refer here](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix)
`(tx == dx and ty == dy)`.

