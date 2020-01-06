var phonecatApp = angular.module('myApp', []);

// Define the `PhoneListController` controller on the `phonecatApp` module
phonecatApp.controller('myController', function PhoneListController($scope) {
  $scope.from = {
    name: 'pbInput',
    options: {
      label: {
        label: 'Label',
        value: 'Username',
        bond: 'interpolation'
      },
      width: {
        label: 'Width',
        value: 4,
        bond: 'constant'
      }
    }
  };

  // {"titre":{"label":"Titre","value":"DefaultValue","bond":"interpolation"},"width":{"label":"Width","value":8,"bond":"constant"}}
  $scope.widgets = {
    pbTitre: {
      name: 'pbTitre',
      options: {
        titre: { label: 'Titre', value: 'DefaultValue', bond: 'interpolation' },
        width: { label: 'Width', value: 8, bond: 'constant' }
      }
    },
    pbLabel: {
      name: 'pbLabel',
      options: {
        label: { label: 'Label', value: 'MyTitle', bond: 'interpolation' },
        width: { label: 'Width', value: 8, bond: 'expression' }
      }
    },
    pbChart: {
      name: 'pbChart',
      options: {
        type: { label: 'Type', type: 'choice', value: 'Doughnut', bond: 'variable' },
        width: { label: 'Width', value: 8, bond: 'constant' },
        data: {
          label: 'Data',
          type: 'collection',
          value: [65, 59, 80, 81, 56, 55, 40]
        }
      }
    }
  };

  $scope.displayWidget = Object.keys($scope.widgets);
  $scope.selectedWidget = 'pbChart';
  $scope.selectedWidgetOption = $scope.widgets[$scope.selectedWidget];

  $scope.internationalization = function() {
    console.log('Je suis call');
    return 'Ben';
  };

  $scope.translate2 = function(key) {
    if (key === 'hello') return 'Hello Work in Japanese !';
    return key;
  };

  $scope.applyConfig = function() {
    let a = document.getElementById('wc1');
    alert(a.result);
  };
});
