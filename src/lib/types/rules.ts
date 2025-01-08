export interface Trigger {
  type: string;
  configuration: Record<string, any>;
}

export interface Action {
  type: string;
  configuration: Record<string, any>;
}

export interface Rule {
  id: string;
  name: string;
  triggers: Trigger[];
  actions: Action[];
} 