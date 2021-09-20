"use strict";
/*!
 * Module requirements.
 */
const uuid = require("uuid");
const util = require("util");
const parser = require("./guid-parser");

function getter(binary) {
  if (!binary) return "";

  if (typeof binary === "string") return binary;

  const len = binary.length();
  const b = binary.read(0, len);
  return parser.GUID(b);
}

function arrayGetter(arr) {
  const result = [];

  if (arr) {
    for (let i = 0; i < arr.length; i++) result.push(getter(arr[i]));
  }

  return result;
}

function arraySetter(arr) {
  const result = [];

  if (arr) {
    for (let i = 0; i < arr.length; i++) result.push(cast(arr[i]));
  }

  return result;
}

function cast(value) {
  if (value === null || value === "") return value;

  if (value._bsontype && value._bsontype == "Binary") return value;

  if (typeof value === "string") return parser.toBin(value);

  throw new Error("Could not cast " + value + " to GUID.");
}

module.exports = (mongoose) => {
  function SchemaGUID(path, options) {
    mongoose.SchemaTypes.Buffer.call(this, path, options);
    this.getters.push(getter);
  }

  /*!
   * Inherits from SchemaType.
   */
  util.inherits(SchemaGUID, mongoose.SchemaTypes.Buffer);

  SchemaGUID.schemaName = "GUID";
  /**
   * Required validator for guid
   *
   * @api private
   */
  SchemaGUID.prototype.checkRequired = function (value) {
    return value;
  };

  /**
   * Casts to guid
   *
   * @param {Object} value to cast
   * @api private
   */
  SchemaGUID.prototype.cast = cast;

  SchemaGUID.prototype.castForQuery = function ($conditional, val) {
    var handler;
    if (arguments.length === 2) {
      handler = this.$conditionalHandlers[$conditional];

      if (!handler)
        throw new Error("Can't use " + $conditional + " with Buffer.");

      return handler.call(this, val);
    } else {
      val = $conditional;
      return this.cast(val);
    }
  };

  return {
    Array: { type: Array, get: arrayGetter, set: arraySetter },
    arrayGetter,
    parse: cast,
    value: uuid.v4,
    type: (mongoose.Types.GUID = mongoose.SchemaTypes.GUID = SchemaGUID),
    GUID: mongoose.Types.GUID,
  };
};
