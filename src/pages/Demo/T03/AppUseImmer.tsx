import * as React from 'react';
import { useImmer } from 'use-immer';

const AppUseImmer = () => {
  const [person, updatePerson] = useImmer({
    name: 'Michel',
    age: 33,
    obj: {
      text: '123',
    },
  });

  function updateName(name: any) {
    updatePerson((draft) => {
      draft.name = name;
    });
  }

  function becomeOlder() {
    updatePerson((draft) => {
      draft.age++;
    });
  }

  function updateText(text: any) {
    updatePerson((draft) => {
      draft.obj.text = text;
    });
  }

  return (
    <div className='App'>
      <h1>This demo is for immer Object23</h1>
      <h1>
        Hello {person.name} ({person.age})
      </h1>
      <h1>{person.obj.text}</h1>
      <input
        onChange={(e) => {
          updateName(e.target.value);
        }}
        value={person.name}
      />
      <input
        onChange={(e) => {
          updateText(e.target.value);
        }}
        value={person.obj.text}
      />
      <br />
      <button onClick={becomeOlder}>Older</button>
    </div>
  );
};

export default AppUseImmer;
