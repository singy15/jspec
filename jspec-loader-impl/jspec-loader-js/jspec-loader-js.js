
function exprp(value) {
  return value !== null && typeof value === 'string' && value.substr(0,1) === "#";
}

function val(expr, root) {
  if(exprp(expr)) {
    return resolve(expr.substr(1), root);
  } else {
    return expr;
  }
}

function resolve(path, root) {
  let cur = root;
  let paths = path.split(".");
  for(var i = 0; i < paths.length; i++) {
    cur = cur[paths[i]];
  }
  return cur;
}

function nodep(value) {
  return value !== null && typeof value === 'object';
}

function traverse(root, node, path, op) {
  // op : (node,parent,absPath,relPath,parentPath,root) => { (node,parent,absPath,relPath,parentPath,root) => ... | falsy }
  for(var key in node) {
    var child = node[key];
    if(nodep(child)) {
      let parentPath = path;
      let absPath = ((path === "")? key : path + "." + key);
      let relPath = key;
      let nextop = op(child, node, absPath, relPath, parentPath, root);
      if(nextop) {
        traverse(root, child, absPath, nextop);
      }
    }
  }
}

function optag(node, parent, absPath, relPath, parentPath, root) {
  if(relPath.indexOf("$") < 0) {
    node.key$ = relPath;
    node.path$ = absPath;
    node.parentPath$ = parentPath;
  }
  return optag;
}

function opuntag(node, parent, absPath, relPath, parentPath, root) {
  if(relPath.indexOf("$") < 0) {
    delete node.key$;
    delete node.path$;
    delete node.parentPath$;
  }
  return opuntag;
}

function tag(root) {
  root.key$ = null;
  root.path$ = "";
  root.parentPath$ = null;
  traverse(root, root, "", optag);
  return root;
}

function untag(root) {
  delete root.key$;
  delete root.path$;
  delete root.parentPath$;
  traverse(root, root, "", opuntag);
  return root;
}

function mv(node, newKey, root) {
  let parent = resolve(node.parentPath$, root);
  parent[newKey] = node;
  delete parent[node.key$];
  traverse(parent, parent, parent.path$, optag);
}

