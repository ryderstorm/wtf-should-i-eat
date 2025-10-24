export interface Restaurant {
  name: string;
  price: string;
  distance: string;
  address: string;
  phone: string;
  website: string;
  hours: {
    Monday?: string;
    Tuesday?: string;
    Wednesday?: string;
    Thursday?: string;
    Friday?: string;
    Saturday?: string;
    Sunday?: string;
  };
  rating: {
    stars: number;
    count: number;
  };
  cuisine: string;
  status: string;
  mapsUri?: string;
}

export interface GroundingChunk {
  maps: {
    title: string;
    uri: string;
  };
}

export type StreamResult =
  | { type: 'restaurant'; data: Restaurant }
  | { type: 'sources'; data: GroundingChunk[] };