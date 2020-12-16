import * as React from 'react';

import useAppHook from './AppHook';
import useDataHook from './useDataHook';

// Level A B C D E, and then [E, D, C, B, A] with reduce
// Level A B C D E, and then [A, B, C, D, E] with reduceRight
const providers = [useDataHook.Provider, useAppHook.Provider];

// 数据 Provider 组合器
const ProvidersComposer = (props: any) => {
  return props.providers.reduceRight((children: any, Parent: any) => <Parent>{children}</Parent>, props.children);
};

const Provider = (props: any) => {
  return <ProvidersComposer providers={providers}>{props.children}</ProvidersComposer>;
};

export default Provider;
