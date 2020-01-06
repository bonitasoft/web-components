/**
 *
 * @param from object
 * @param to object
 * @param allProperties object {selected:'',key: ''}
 */
function mapping(from, to, allProperties) {
  let options = {};
  allProperties.forEach(prop => {
    let selectedItem = prop.selected;
    let propertyId = prop.key;
    if (to.hasOwnProperty(propertyId)) {
      options[propertyId] = {
        type: getType(from[selectedItem], to[propertyId]),
        value:
          from[selectedItem] !== undefined
            ? from[selectedItem].value
            : to[propertyId].value || to[propertyId].defaultValue
      };
    }
  });
  return options;
}

/**
 * Get Type of property
 * @param from
 * @param to
 * @returns {*}
 */
function getType(from, to) {
  // Check if a mapping is done
  if (from) {
    return from.type;
  }

  // By default expression value is a constant
  if (to.bond === 'expression') {
    return 'constant';
  }
  return to.bond;
}

export default mapping;
