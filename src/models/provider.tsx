import * as React from 'react';

import AppHook from './AppHook';

// Level A B C D E, and then [E, D, C, B, A]
const providers = [AppHook.Provider];

// 数据 Provider 组合器
const ProvidersComposer = (props: any) => {
  return props.providers.reduceRight((children: any, Parent: any) => <Parent>{children}</Parent>, props.children);
};

const Provider = (props: any) => {
  return <ProvidersComposer providers={providers}>{props.children}</ProvidersComposer>;
};

export default Provider;
