declare module "*.css";

declare namespace JSX {
  interface IntrinsicElements {
    "s-app-nav": React.HTMLAttributes<HTMLElement>;
    "s-link": React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href?: string;
      target?: string;
    };
    "ui-save-bar": React.HTMLAttributes<HTMLElement> & { id?: string };
  }
}

declare module "react" {
  interface ButtonHTMLAttributes<T> {
    variant?: string;
  }
}
