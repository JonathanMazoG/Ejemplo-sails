/**
 * nokResponse.js
 *
 * A custom response.
 *
 * Example usage:
 * ```
 *     return res.nokResponse();
 *     // -or-
 *     return res.nokResponse(optionalData);
 * ```
 *
 * Or with actions2:
 * ```
 *     exits: {
 *       somethingHappened: {
 *         responseType: 'nokResponse'
 *       }
 *     }
 * ```
 *
 * ```
 *     throw 'somethingHappened';
 *     // -or-
 *     throw { somethingHappened: optionalData }
 * ```
 */

module.exports = function okResponse({ mensaje, datos }) {
  sails.log.verbose('---> Ran custom response: res.okResponse()');
  //sails.log.verbose('Detalle', mensaje, datos);

  var res = this.res;

  // Define the status code to send in the response.
  var statusCodeToSet = 200;

  // Define el objeto defecto de respuesta
  let ejecucion = {
    respuesta: {
      estado: 'OK',
      mensaje: mensaje || 'Ejecución satisfactoria',
    },
    datos: datos || {},
  };

  return res.status(statusCodeToSet).send({ ejecucion: ejecucion });
};
