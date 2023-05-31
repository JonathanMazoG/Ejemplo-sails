module.exports = {
  friendlyName: 'listar clientes',

  description: '',

  inputs: {
    pagination: {
      description: 'Filtros de la paginacion.',
      example: 'Objeto paginacion ',
      type: 'ref',
      required: true,
    },

    filter: {
      description: 'Filtros de la paginacion.',
      example: 'Objeto paginacion ',
      type: 'ref',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'Finalización satisfactoria para enviar OK',
      responseType: 'okResponse',
    },

    errorGeneral: {
      description: 'Un error sin identificar generado en el try/catch.',
      responseType: 'nokResponse',
    },
  },

  fn: async function ({ pagination, filter }, exits) {
    sails.log.verbose('-----> Listar clientes');
    sails.log.verbose('Paginacion', pagination, '\n', 'filtro', filter);
    var flaverr = require('flaverr');

    try {

      let { page, rowsPerPage, sortBy, descending } = pagination;
      const startRow = (page - 1) * rowsPerPage;
      let filtroSortBy = [];
      let sort = {};
      if (sortBy) {
        sails.log.verbose('con sortBy', sortBy);
        sort[sortBy] = descending === 'true' ? 'DESC' : 'ASC';
        filtroSortBy = [sort];
      } else {
        filtroSortBy = [{ nombre: 'ASC' }];
      }

      let filtroWhere = {};

      if (filter.nombreCliente) {
        if (filter.nombreCliente.includes(' ')) {
          const nombreCliente = filter.nombreCliente;
          filtroWhere['nombre'] = { contains: nombreCliente };

        } else {
          filtroWhere['nombre'] = { contains: filter.nombreCliente };
        }
      }


      if (filter.identificacionCliente) {
        filtroWhere['identificacion'] = filter.identificacionCliente;
      }

      let queryCount = {
        where: filtroWhere,
      };

      let queryTabla = {
        select: [
          'tipoidentificacion',
          'identificacion',
          'nombre',
        ],
        where: filtroWhere,
        skip: startRow,
        limit: 10,
        sort: filtroSortBy,
      };
      pagination.rowsNumber = await Cliente.count(queryCount);

      sails.log.verbose('filtroWhere', filtroWhere);
      const clientes = await Cliente.find(queryTabla);
      sails.log.verbose('clientes registrados: ', clientes);

      return exits.success({
        mensaje: 'Listado de los clientes esta correcto',
        datos: {
          pagination: pagination,
          records: {
            data: clientes,
          },
        },
      });
    } catch (error) {
      throw flaverr(
        {
          code: 'E_LISTAR_CLIENTE',
        },
        error
      );
    }
  },
};
