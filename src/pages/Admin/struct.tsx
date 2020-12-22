const returnItemTypeStruct = (ifEdit: boolean = false) => {
  let obj: any;

  if (ifEdit) {
    obj = {
      id: {
        label: 'ID',
        sort: 101,
      },
      name: {
        label: '链接类型',
        sort: 100,
      },
      sort: {
        label: '排序',
        required: false,
      },
    };
  } else {
    obj = {
      name: {
        label: '链接类型',
        sort: 100,
      },
      sort: {
        label: '排序',
        required: false,
      },
    };
  }

  let tmp = [
    {
      name: 'id',
      label: 'ID',
      style: {
        display: 'none',
      },
    },
    {
      name: 'name',
      label: '链接类型',
    },
    {
      name: 'sort',
      label: '排序',
    },
  ];

  return tmp
    .map((item: any) => {
      let c = obj[item.name];
      if (c) {
        item.label = c.label;
        item.required = c.required === undefined ? true : c.required;
        item.sId = c.sort;
        return item;
      }
      return null;
    })
    .filter((item) => item !== null)
    .sort((a, b) => b.sId - a.sId);
};

export { returnItemTypeStruct };
