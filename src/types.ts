export interface PolymerUser {
  id: number;
  external_id: string;
  name: string;
  email: string;
  type: string;
  account_id: number;
}

export interface PolymerTeam {
  id: number;
  external_id: string;
  name: string;
  platform: string;
  platform_slug: string;
  mode: string;
}

export interface PolymerChannel {
  id: number;
  external_id: string;
  name: string;
  type: string;
  external_parent: string | null;
}

export interface PolymerRule {
  id: string;
  name: string;
  count: string; // The type of string was verified in both provided documentation as well as in test responses
}

export interface PolymerItem {
  id: number;
  name: string;
  time: string;
  file: {
    id: string | null;
    name: string | null;
  };
  event: {
    external_id: string;
    time: string;
  };
  team: PolymerTeam;
  user: PolymerUser;
  channel: PolymerChannel;
  rules: [PolymerRule];
}

export interface PolymerPagination {
  current: number;
  last: number;
  next_url: string | null;
}

export interface PolymerResponse {
  pagination: PolymerPagination;
  count: number;
  items: [PolymerItem];
}
