export interface ProcessedInventory {
  assets: {assetUrl: string}[];
  id: string;
  title: string;
  status: string;
  committed: number;
  available: number;
  channels: Channel[];
  variants: ProcessedVariant[];
  code: string;
}

export interface Channel {
  name: string;
  status: number;
}

interface ProcessedVariant {
  id: string;
  code: string;
  status: string;
  committed: number;
  available: number;
  channels: Channel[];
  assetUrl: string;
  title?: string;
  channelData: {
    channelType: string
  }[];

}