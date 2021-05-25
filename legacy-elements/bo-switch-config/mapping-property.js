/**
 *
 * @param from object
 * @param to object
 * @param allProperties object {selected:'',key: ''}
 */
export function mapping(from, to, allProperties) {
  let options = {};
  allProperties.forEach(prop => {
    let selectedItem = prop.selected;
    let propertyId = prop.key;
    if (to.hasOwnProperty(propertyId)) {
      let finalType= getType(from[selectedItem], to[propertyId]);
      let finalValue = from[selectedItem] !== undefined
          ? from[selectedItem].value
          : to[propertyId].value || to[propertyId].defaultValue;
      options[propertyId] = {
        type: finalType,
        value: convertValueAsStringIfFinalTypeIsNotAConstant(finalValue, finalType, to[propertyId].type)
      };
    }
  });
  return options;
}

function convertValueAsStringIfFinalTypeIsNotAConstant(value, finalType){
  if(value != undefined && finalType !== 'constant'){
     return value.toString();
  }
  return value;
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
    if(to.bond === 'variable' || to.bond === 'interpolation'){
      //Return variable to keep property type in new mapping
      return to.bond;
    }
    return from.type;
  }

  // By default expression value is a constant
  if (to.bond === 'expression') {
    return 'constant';
  }
  return to.bond;
}

function isAnInteger(fromType) {
  return /^-?\d+$/.test(fromType.value) && typeof fromType.value !== 'boolean';
}

/**
 * Check if mapping is compatible
 * @param toBond
 * @param fromType
 * @returns {boolean|*} true if mapping is incompatible
 */
export function isIncompatibleMapping(toBond, fromType){
  if(toBond.bond === 'constant' && fromType.type === 'constant' ){
    switch (toBond.type){
      case 'integer':
        return !isAnInteger(fromType);
      case 'boolean':
        return typeof fromType.value !== 'boolean'
      default:
        return false;
    }
  }else {
    return (fromType.type != 'constant' && toBond.bond === 'constant')
        || ((toBond.bond === 'variable' || toBond.bond === 'constant') && fromType.type === 'interpolation');
  }
}

