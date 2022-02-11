export default interface CardPanelState {
  name?: string;
  description?: string;
  logo?: string;
  url?: string;
  uuid?: string;
  class?: string; // custom class for styles
  action?: string; // click action
  data?: any;
  type?: string;
  tags?: PanelTag[];
}

export interface PanelTag {
  label: string;
  value: string;
}
