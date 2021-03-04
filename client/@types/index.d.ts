declare module '*.svg' {
  const content: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}
