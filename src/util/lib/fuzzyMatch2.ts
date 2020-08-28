import { ListItemInterface } from '../../Interfaces';

const fuzzyMatches = (fuzzy: string, text: string) => {
  fuzzy = fuzzy.toLowerCase();
  text = text.toLowerCase();

  let tp = 0; // text position / pointer
  let matches = [];

  // match algorithm 匹配算法，之后再改
  for (let i = 0; i < fuzzy.length; i++) {
    const f = fuzzy[i];

    for (; tp < text.length; tp++) {
      const t = text[tp];
      if (f === t) {
        matches.push(tp);
        tp++;
        break;
      }
    }
  }

  return matches;
};

const fuzzyList = (fuzzy: string, list: Array<ListItemInterface>, mode = 0) => {
  const results = [];

  for (let i = 0; i < list.length; i++) {
    const originalIndex = i;

    let item;
    if (mode === 0) {
      item = list[i].name;
    }
    if (mode === 1) {
      item = list[i].title;
    }
    if (mode === 2) {
      item = list[i].title;
    }
    if (mode === 3) {
      item = list[i].link;
    }

    const matches = fuzzyMatches(fuzzy, item);

    if (matches.length === fuzzy.length) {
      let t = item;

      for (let i = 0; i < matches.length; i++) {
        const index = matches[matches.length - (i + 1)];

        // high light the matched result
        // const c = clcFgMatchYellow(t[index]);
        // const c = clcBgYellow(clcFgMatchBlack(t[index]));
        const c = t[index];
        t = t.slice(0, index) + '<span class="em">' + c + '</span>' + t.slice(index + 1);
      }

      results.push({
        originalIndex,
        original: item,
        colored: t
      });
    }
  }

  let i = 0;
  // sorts in-place
  console.time('fuzzy sort');
  // replace it to quick sort later
  results.sort((a, b) => {
    i++;
    if (a.original < b.original) return -1;
    return 1;
  });
  console.timeEnd('fuzzy sort');
  console.log('fuzzy sort end, i: ', i, 'results.length: ', results.length, ' list.length: ', list.length);
  return results;
};

const transformData = (data: Array<any>, mode: number) => {
  let ret: Array<any> = [];
  for (let i = 0; i < data.length; i++) {
    let item;

    if (mode === 0) {
      item = data[i].name;
    }
    if (mode === 1) {
      item = data[i].title;
    }
    if (mode === 2) {
      item = data[i].title;
    }
    if (mode === 3) {
      item = data[i].link;
    }

    ret.push({
      originalIndex: i,
      original: item,
      colored: item
    });
  }
  return ret;
};

export { fuzzyMatches, fuzzyList, transformData, ListItemInterface };
