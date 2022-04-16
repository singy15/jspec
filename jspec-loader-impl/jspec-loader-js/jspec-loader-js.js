
function val(expr, root) {
  let cur = root;
  let paths = expr.substr(1).split(".");
  for(var i = 0; i < paths.length; i++) {
    cur = root[paths[i]];
  }
  return cur;
}

function nodep(value) {
  return value !== null && typeof value === 'object';
}

function traverse(root, node, path, op) {
  // op : (node,parent,path,root) => boolean : continue traverse?
  if(nodep(node)) {
    for(var key in node) {
      if(key === "parent" || key === "path") {
        continue;
      }
      var child = node[key];
      if(nodep(child)) {
        let childPath = ((path === "")? key : path + "." + key);
        let nextop = op(child, node, childPath, root);
        if(nextop) {
          traverse(root, child, childPath, nextop);
        }
      }
    }
  }
}

function optag(node, parent, path, root) {
  node.parent = parent;
  node.path = path;
  return optag;
}

function opuntag(node, parent, path, root) {
  delete node.parent;
  delete node.path;
  return opuntag;
}

function tag(root) {
  traverse(root, root, "", optag);
  return root;
}

function untag(root) {
  traverse(root, root, "", opuntag);
  return root;
}

function mv(node, newKey, root) {
  for(var k in node.parent) {
    if(node == node.parent[k]) {
      node.parent[newKey] = node;
      delete node.parent[k];
      traverse(node.parent, node.parent, node.parent.path, optag);
      return node.parent;
    }
  }
}

function init(root) {
  tag(root);
  return root;
}

