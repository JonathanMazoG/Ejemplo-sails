module.exports = {
  friendlyName: "Agregar cliente",

  description: "Crear un nuevo cliente en la BD",

  inputs: {
    datosCliente: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "Finalización satisfactoria para enviar OK",
      responseType: "okResponse",
    },

    errorGeneral: {
      description: "Un error sin identificar generado en el try/catch.",
      responseType: "nokResponse",
    },
  },

  fn: async function ({ datosCliente }, exits) {
    sails.log.verbose("-----> Agregar cliente");
    sails.log.verbose("cliente a agregar", datosCliente);
    var flaverr = require("flaverr");

    try {
      let registroCliente = {};
      let cliente = await Cliente.findOne(datosCliente);
      if (cliente) {
        sails.log.verbose("El cliente ya existe", registroCliente);

        return exits.success({
          mensaje: "El cliente ya existe",
          datos: {
            datosCliente,
          },
        });
      } else {
        await Cliente.getDatastore().transaction(async (db) => {
          registroCliente = await Cliente.create(datosCliente)
            .usingConnection(db)
            .fetch();
        });

        sails.log.verbose("Cliente ingresado en la BD", registroCliente);

        return exits.success({
          mensaje: "Consulta del cliente esta correcta",
          datos: {
            registroCliente,
          },
        });
      }
    } catch (error) {
      throw flaverr(
        {
          code: "E_AGREGAR_NUEVO_CLIENTE",
        },
        error
      );
    }
  },
};
