import * as React from "react";

export interface AppProps {
  compiler: string;
  framework: string;
}

export const App = (props: AppProps) => <h1>Hello2222 from { props.compiler } and { props.framework }!</h1>;