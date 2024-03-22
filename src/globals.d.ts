/// <reference types="vite/client" />
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare global {
  interface ImportMeta {
    env: {
      [key: string]: string;
    };
  }
}

