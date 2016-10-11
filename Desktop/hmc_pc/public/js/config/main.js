require.config({
  waitSeconds : 15,
  baseUrl: '/js',
  paths: {
    'jquery': 'lib/jquery-1.12.4.min',
    'domReady': 'lib/domReady',
    'fetch': 'lib/fetch',
    'Raphael': 'lib/raphael.min',
    'priceCurve': 'modules/price_curve',
    'carModel': 'modules/carModel',
		'polyfill':'lib/polyfill.min',
    'map': 'modules/map',
    'selectCarType': 'modules/select_car_type',
    'fotorama': 'plugins/fotorama/fotorama',
    'fresco': 'plugins/fresco/fresco',
    'jssor': 'lib/jssor.slider.mini',
    'ejs': 'lib/ejs.min',
    'text': 'lib/text',
		'config':'config',
		'purchase':'modules/purchase',
		'pingpp':'lib/pingpp'
  },
  shim: {
    'fotorama': {
      deps: ['jquery']
    },
    'fresco': {
      deps: ['jquery']
    },
    'ejs': {
      deps: ['jquery']
    },
    'jssor': {
      deps: ['jquery']
    }
  }
});
