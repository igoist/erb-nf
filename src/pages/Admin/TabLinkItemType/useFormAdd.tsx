import useModelVisible from '../useModelVisible';

const api = '/api/v1/item/type/';

export default () => {
  const { visible: visibleFormAddItemType, closeModel: closeFormAddItemType, openModel: openFormAddItemType } = useModelVisible();

  const onFormAddItemTypeFinish = async (values: any) => {
    closeFormAddItemType();

    console.log('onFormAddItemTypeFinish: ', values);

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

    console.log('onFormAddItemTypeFinish msg: ', r);
  };

  const addItemTypeFields = [
    {
      name: 'name',
      label: '链接类型',
      required: true,
    },
    {
      name: 'sort',
      label: '排序',
      required: false,
    },
  ];

  return {
    addItemTypeFields,
    visibleFormAddItemType,
    closeFormAddItemType,
    openFormAddItemType,
    onFormAddItemTypeFinish,
  };
};
