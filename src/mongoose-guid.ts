'use strict'
/*!
 * Module requirements.
 */
import * as uuid from 'uuid'
import * as parser from './guid-parser'
import { Mongoose, SchemaTypes } from 'mongoose'

export default (mongoose: Mongoose) => {
  class Guid extends SchemaTypes.Buffer {
    constructor(key: string, options: any) {
      super(key, options, 'GUID')
      console.log('constructor')
      this.subtype(3)
    }

    cast(value: string | Guid) {
      if (value === null || value === '') {
        return value
      }

      if (typeof value === 'string') {
        return parser.toBin(value, mongoose)
      }

      if (value instanceof mongoose.mongo.Binary) {
        return value
      }

      throw new Error('Could not cast ' + value + ' to GUID.')
    }

    castForQuery($conditional: string, val: string | Buffer) {
      if (arguments.length === 2) {
        const handler = (this as any).$conditionalHandlers[$conditional]

        if (!handler)
          throw new Error("Can't use " + $conditional + ' with Buffer.')

        return handler.call(this, val)
      }

      val = $conditional
      return this.cast(val)
    }

    getter(binary: any) {
      if (!binary) {
        return ''
      }

      if (typeof binary === 'string') {
        return binary
      }

      const len = binary.length()
      const b = binary.read(0, len)
      return parser.toGuid(b)
    }

    checkRequired(value: unknown) {
      return value
    }
  }

  mongoose.Types.Guid = mongoose.Schema.Types.Guid = Guid

  return mongoose.Types.Guid
  // function arrayGetter(arr) {
  //   const result = []

  //   if (arr) {
  //     for (let i = 0; i < arr.length; i++) {
  //       result.push(getter(arr[i]))
  //     }
  //   }

  //   return result
  // }

  // function arraySetter(arr) {
  //   const result = []

  //   if (arr) {
  //     for (let i = 0; i < arr.length; i++) {
  //       result.push(cast(arr[i]))
  //     }
  //   }

  //   return result
  // }

  // /**
  //  * Required validator for guid
  //  *
  //  * @api private
  //  */
  // SchemaGUID.prototype.checkRequired = function (value) {
  //   return value
  // }
}
