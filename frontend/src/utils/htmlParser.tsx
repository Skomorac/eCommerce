// src/utils/htmlParser.ts
import parse, { domToReact, HTMLReactParserOptions } from "html-react-parser";
import { Element } from "domhandler";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof Element && domNode.attribs) {
      // Remove any script tags
      if (domNode.name === "script") {
        return <></>;
      }
      // Remove any attributes starting with 'on' (e.g., onclick, onmouseover)
      const attribs = { ...domNode.attribs };
      Object.keys(attribs).forEach((key) => {
        if (key.startsWith("on")) {
          delete attribs[key];
        }
      });
      return (
        <domNode.name {...attribs}>
          {domToReact(domNode.children, options)}
        </domNode.name>
      );
    }
  },
};

export const parseHtml = (html: string): JSX.Element => {
  return <>{parse(html, options)}</>;
};
