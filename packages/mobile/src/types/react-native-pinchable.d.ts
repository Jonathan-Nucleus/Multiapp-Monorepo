declare module 'react-native-pinchable' {
  export interface PinchableProps {
    minimumZoomScale?: number;
    maximumZoomScale?: number;
  }

  declare const Pinchable: React.FC<PinchableProps>;

  export = Pinchable;
}
