/**
 * Convert a BDM json string into a csak-tree json string
 *
 * @class CsakTreeBuilder
 */
export default class CsakTreeBuilder {
  constructor(bdmJson, filter) {
    this.bdmJson = bdmJson;
    this.filter = filter;
    this.csakBusObjectsMap = new Map();
  }

  build() {
    return this._bdmAsCsakTree();
  }

  _bdmAsCsakTree() {
    let bdm = this.bdmJson;
    let res = {};

    if (
      !bdm ||
      !bdm.businessObjectModel ||
      !bdm.businessObjectModel.businessObjects ||
      !bdm.businessObjectModel.businessObjects.businessObject
    ) {
      return JSON.stringify(res);
    }

    let csakTree = {};
    csakTree.children = [];
    let csakGlobalObject = {};
    csakGlobalObject.children = [];

    let bdmBusObjects = bdm.businessObjectModel.businessObjects.businessObject;
    let myself = this;

    // 1st phase: Build root objects, without relations attributes
    bdmBusObjects.forEach(function(bdmBusObject) {
      let csakBusObject = myself._bdmBusObjectToCsak(bdmBusObject);
      myself.csakBusObjectsMap.set(csakBusObject.name, csakBusObject);
    });

    // 2nd phase: Build the full tree, embedding relations
    this.csakBusObjectsMap.forEach(csakBusObject => {
      let fullCsakObject = myself._embedRelations(csakBusObject);
      this._csakObjectFiltered(fullCsakObject);
      if (fullCsakObject.children.length !== 0) {
        // we may have no children after filtering
        csakGlobalObject.children.push(fullCsakObject);
      }
    });

    csakTree.children.push(csakGlobalObject);
    res = { children: csakTree.children[0].children };
    return JSON.stringify(res);
  }

  _bdmBusObjectToCsak(bdmBusObject) {
    // Business object
    let csakBusObject = {};
    let qn = bdmBusObject.qualifiedName;
    csakBusObject.name = CsakTreeBuilder._getLastItem(qn);
    csakBusObject.qualifiedName = qn;
    csakBusObject.children = [];

    // Business object attributes
    let bdmAtts = bdmBusObject.fields.field;
    if (bdmAtts) {
      let bdmAttsArray = CsakTreeBuilder._asArray(bdmAtts);
      bdmAttsArray.forEach(bdmAtt => {
        let csakAtt = {};
        csakAtt.name = bdmAtt.name;
        csakBusObject.children.push(csakAtt);
      });
    }

    // Business object attribute relations
    let bdmAttRels = bdmBusObject.fields.relationField;
    if (bdmAttRels) {
      let bdmAttRelsArray = CsakTreeBuilder._asArray(bdmAttRels);
      bdmAttRelsArray.forEach(bdmAttRel => {
        let csakAttRel = {};
        csakAttRel.reference = bdmAttRel.reference;
        let referenceName = CsakTreeBuilder._getLastItem(csakAttRel.reference);
        // TODO: should display artifact (like reference name) outside the tree node name...
        csakAttRel.name = bdmAttRel.name + ' (' + referenceName + ')';
        csakBusObject.children.push(csakAttRel);
      });
    }
    return csakBusObject;
  }

  _embedRelations(csakBusObject) {
    let myself = this;
    csakBusObject.children.forEach(csakAtt => {
      if (csakAtt.reference) {
        let referenceName = CsakTreeBuilder._getLastItem(csakAtt.reference);
        let referenceObject = myself.csakBusObjectsMap.get(referenceName);
        csakAtt.children = myself._embedRelations(referenceObject).children;
      }
    });
    return csakBusObject;
  }

  static _getLastItem(path) {
    return path.substring(path.lastIndexOf('.') + 1);
  }

  static _asArray(element) {
    // Put element in an array (if needed)
    let arr;
    if (!Array.isArray(element)) {
      arr = [];
      arr.push(element);
    } else {
      arr = element;
    }
    return arr;
  }

  _isStringFiltered(item) {
    return !this.filter || item.toLowerCase().includes(this.filter.toLowerCase());
  }

  _csakObjectFiltered(csakObject) {
    if (this._isStringFiltered(csakObject.name)) {
      return;
    }
    let newChildren = [];
    let myself = this;
    csakObject.children.forEach(csakAtt => {
      if (this._isStringFiltered(csakAtt.name)) {
        newChildren.push(csakAtt);
      } else if (csakAtt.reference) {
        myself._csakObjectFiltered(csakAtt);
        if (csakAtt.children.length !== 0) {
          // we may have no children after filtering
          newChildren.push(csakAtt);
        }
      }
    });
    csakObject.children = newChildren;
  }
}
