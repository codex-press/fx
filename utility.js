

export function textNodes(el) {

  let textHarvester = (list, node) => {
    // it's a text node
    if (node.nodeType === 3)
      list.push(node);
    // it's an element, so descend tree and add children
    else if (node.nodeType === 1)
      Array.from(node.childNodes).reduce(textHarvester, list);
    return list;
  }

  return Array.from(el.childNodes).reduce(textHarvester, []);
}


