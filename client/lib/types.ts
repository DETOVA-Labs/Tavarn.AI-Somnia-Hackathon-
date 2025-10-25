export interface Asset {
  id: string;
  name: string;
  price: string;
  image: string;
  inventory: number;
}

export interface BlacklistedUser {
  id: string;
  address: string;
  blacklist_reason: string;
  link_to_evidence?: string;
  created_at: any;
  reports: number;
  status: string;
  updated_at: any;
}

export type Address = `0x${string}`;

export interface Log {
  address: Address;
  args: { [key: string]: any };
  eventName: string;
}
