import mapping from '../mapping-property';

describe('Mapping function', () => {
  it('should return value of from widget when all properties is mapping', () => {
    let from = {
      cssClasses: { type: 'constant', value: 'well jumbotron', label: 'CSS classes' },
      label: { type: 'interpolation', value: 'Default label', label: 'Label' },
      value: { type: 'variable', value: 'user', label: 'Value' }
    };

    let to = {
      cssClasses: { type: 'constant', value: '', label: 'CSS classes' },
      label: { type: 'interpolation', value: 'This is my label', label: 'Label' },
      value: { type: 'variable', value: '', label: 'Value' }
    };

    let optionsSelected = [
      { selected: 'cssClasses', key: 'cssClasses' },
      { selected: 'label', key: 'label' },
      { selected: 'value', key: 'value' }
    ];

    let res = mapping(from, to, optionsSelected);
    let expected = {
      cssClasses: { type: 'constant', value: 'well jumbotron' },
      label: { type: 'interpolation', value: 'Default label' },
      value: { type: 'variable', value: 'user' }
    };
    expect(res).toEqual(expected);
  });

  it('should return default value of widget to when no property is selected', () => {
    let from = {
      cssClasses: { type: 'constant', value: 'well jumbotron', label: 'CSS classes' },
      label: { type: 'interpolation', value: 'Default label', label: 'Label' },
      value: { type: 'variable', value: 'user', label: 'Value' }
    };

    let to = {
      cssClasses: { bond: 'expression', type: 'string', value: '', label: 'CSS classes' },
      label: {
        bond: 'interpolation',
        type: 'interpolation',
        value: 'This is my label',
        label: 'Label'
      },
      value: { bond: 'variable', type: 'variable', value: '', label: 'Value' },
      availableValues: {
        label: 'Available values',
        type: 'collection',
        defaultValue: ['green', 'red', 'blue'],
        bond: 'expression'
      }
    };

    let optionsSelected = [
      { selected: '', key: 'cssClasses' },
      { selected: '', key: 'label' },
      { selected: '', key: 'value' },
      { selected: '', key: 'availableValues' }
    ];

    let res = mapping(from, to, optionsSelected);
    let expected = {
      cssClasses: { type: 'constant', value: undefined },
      label: { type: 'interpolation', value: 'This is my label' },
      value: { type: 'variable', value: undefined },
      availableValues: { type: 'constant', value: ['green', 'red', 'blue'] }
    };
    expect(res).toEqual(expected);
  });

  it('should return mapping when from property is used for an other to property', () => {
    let from = {
      cssClasses: { type: 'constant', value: 'well jumbotron', label: 'CSS classes' },
      label: { type: 'interpolation', value: 'Default label', label: 'Label' },
      placeholder: { type: 'interpolation', value: 'My Placeholder', label: 'Placeholder' },
      value: { type: 'variable', value: 'user', label: 'Value' }
    };

    let to = {
      cssClasses: { type: 'constant', value: '', label: 'CSS classes' },
      label: { type: 'interpolation', value: 'This is my label', label: 'Label' },
      value: { type: 'variable', value: '', label: 'Value' }
    };

    let optionsSelected = [
      { selected: 'cssClasses', key: 'cssClasses' },
      { selected: 'placeholder', key: 'label' },
      { selected: 'placeholder', key: 'value' }
    ];

    let res = mapping(from, to, optionsSelected);
    let expected = {
      cssClasses: { type: 'constant', value: 'well jumbotron' },
      label: { type: 'interpolation', value: 'My Placeholder' },
      value: { type: 'interpolation', value: 'My Placeholder' }
    };
    expect(res).toEqual(expected);
  });
});
