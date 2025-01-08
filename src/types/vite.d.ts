/// <reference types="vite/client" />

declare module '*.svelte' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

declare module 'svelte-routing' {
  import type { SvelteComponent } from 'svelte';

  export interface LinkProps {
    to: string;
    replace?: boolean;
  }

  export class Link extends SvelteComponent<LinkProps> {}

  export interface RouterProps {
    url?: string;
  }

  export class Router extends SvelteComponent<RouterProps> {}

  export interface RouteProps {
    path?: string;
    component?: typeof SvelteComponent;
  }

  export class Route extends SvelteComponent<RouteProps> {}

  export function navigate(to: string, options?: { replace?: boolean }): void;
} 