var blueprintConfig = require('./local');

var ROUTE_PREFIX = blueprintConfig.prefix || '';

// add global prefix to manually defined routes
function addGlobalPrefix(routes) {
  var paths = Object.keys(routes);
  var newRoutes = {};

  if (ROUTE_PREFIX === '') {
    return routes;
  }

  paths.forEach((path) => {
    var pathParts = path.split(' ');
    var uri = pathParts.pop();
    var prefixedURI = '';
    var newPath = '';

    prefixedURI = ROUTE_PREFIX + uri;

    pathParts.push(prefixedURI);

    newPath = pathParts.join(' ');
    // construct the new routes
    newRoutes[newPath] = routes[path];
  });

  return newRoutes;
}

module.exports.routes = addGlobalPrefix({
  /*
   * Rutas para las acciones de los clientes
   *
   */
  'GET /clientes': { action: 'gestion-clientes/listar-clientes' },

  'POST /clientes/agregar': { action: 'gestion-clientes/agregar-cliente' },

});
