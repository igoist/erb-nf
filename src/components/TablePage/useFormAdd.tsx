import { useModelVisible } from '@Hooks';

import { UseFormAddProps } from '@Types';

export default ({ api, fieldsStruct }: UseFormAddProps) => {
  const { visible: visibleFormAdd, closeModel: closeFormAdd, openModel: openFormAdd } = useModelVisible();

  const onFormAddFinish = async (values: any) => {
    closeFormAdd();

    console.log('onFormAddFinish: ', values);

    let r = await fetch(`http://localhost:6085${api}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((res) => res);

    console.log('onFormAddFinish msg: ', r);
  };

  return {
    addFields: fieldsStruct, // returnItemTypeStruct(),
    visibleFormAdd,
    closeFormAdd,
    openFormAdd,
    onFormAddFinish,
  };
};
