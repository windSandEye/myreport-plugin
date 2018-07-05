import { assign } from 'lodash';

export const parseTreeData = (source, config?) => {
  const { idKey, pidKey } = assign({
    idKey: 'id',
    pidKey: 'pid',
  }, config);
  const parent = source.filter((item) => !item[pidKey]);
  const loop = (list, pool, level) => {
    list.forEach(node => {
      node.children = pool.filter(item => item[pidKey] === node[idKey]);
      if (node.children.length === 0) {
        delete node.children;
      } else {
        level += 1;
        if (level < 3) {
          loop(node.children, pool, level);
        }
      }
    });
  };
  loop(parent, source, 0);
  return parent;
};
