declare module 'react-plotly.js' {
  import { Component } from 'react';
  import type { Layout, Config, Data } from 'plotly.js';

  interface PlotParams {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    style?: React.CSSProperties;
    className?: string;
    onInitialized?: (figure: { data: Data[]; layout: Partial<Layout> }) => void;
    onUpdate?: (figure: { data: Data[]; layout: Partial<Layout> }) => void;
    onPurge?: () => void;
    onError?: (err: Error) => void;
  }

  export default class Plot extends Component<PlotParams> {}
}

declare module 'react-leaflet' {
  import { Component, ReactNode } from 'react';
  import * as Leaflet from 'leaflet';

  interface MapContainerProps {
    center: [number, number] | Leaflet.LatLngExpression;
    zoom: number;
    scrollWheelZoom?: boolean;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  interface TileLayerProps {
    attribution?: string;
    url: string;
  }

  interface PolylineProps {
    positions: [number, number][] | Leaflet.LatLngExpression[];
    pathOptions?: Leaflet.PathOptions;
  }

  interface CircleMarkerProps {
    center: [number, number] | Leaflet.LatLngExpression;
    radius?: number;
    pathOptions?: Leaflet.PathOptions;
    children?: ReactNode;
  }

  interface PopupProps {
    children?: ReactNode;
    className?: string;
  }

  export class MapContainer extends Component<MapContainerProps> {}
  export class TileLayer extends Component<TileLayerProps> {}
  export class Polyline extends Component<PolylineProps> {}
  export class CircleMarker extends Component<CircleMarkerProps> {}
  export class Popup extends Component<PopupProps> {}
}
