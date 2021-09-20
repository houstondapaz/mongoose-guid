import { Mongoose } from 'mongoose'

const base64Digits =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

function base64ToHex(base64: string) {
  const hexDigits = '0123456789abcdef'
  let hex = ''
  for (let i = 0; i < 24; ) {
    const e1 = base64Digits.indexOf(base64[i++])
    const e2 = base64Digits.indexOf(base64[i++])
    const e3 = base64Digits.indexOf(base64[i++])
    const e4 = base64Digits.indexOf(base64[i++])
    const c1 = (e1 << 2) | (e2 >> 4)
    const c2 = ((e2 & 15) << 4) | (e3 >> 2)
    const c3 = ((e3 & 3) << 6) | e4
    hex += hexDigits[c1 >> 4]
    hex += hexDigits[c1 & 15]
    if (e3 != 64) {
      hex += hexDigits[c2 >> 4]
      hex += hexDigits[c2 & 15]
    }
    if (e4 != 64) {
      hex += hexDigits[c3 >> 4]
      hex += hexDigits[c3 & 15]
    }
  }
  return hex
}

function hexToBase64(hex: string) {
  var base64 = ''
  var group
  for (var i = 0; i < 30; i += 6) {
    group = parseInt(hex.substr(i, 6), 16)
    base64 += base64Digits[(group >> 18) & 0x3f]
    base64 += base64Digits[(group >> 12) & 0x3f]
    base64 += base64Digits[(group >> 6) & 0x3f]
    base64 += base64Digits[group & 0x3f]
  }
  group = parseInt(hex.substr(30, 2), 16)
  base64 += base64Digits[(group >> 2) & 0x3f]
  base64 += base64Digits[(group << 4) & 0x3f]
  base64 += '=='
  return base64
}

function generateHex(hex: string) {
  const a =
    hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2)
  const b = hex.substr(10, 2) + hex.substr(8, 2)
  const c = hex.substr(14, 2) + hex.substr(12, 2)
  const d = hex.substr(16, 16)
  return a + b + c + d
}

export function toBin(guid: string, mongoose: Mongoose) {
  const hex = generateHex(guid.replace(/[{}-]/g, ''))
  const base64 = hexToBase64(hex)
  const buf = Buffer.from(base64, 'base64')

  return mongoose.Types.Buffer.from(buf, 3)
}

export function toGuid(buffer: Buffer) {
  let hex = generateHex(base64ToHex(buffer.toString('base64'))) // don't use BinData's hex function because it has bugs in older versions of the shell
  return (
    hex.substr(0, 8) +
    '-' +
    hex.substr(8, 4) +
    '-' +
    hex.substr(12, 4) +
    '-' +
    hex.substr(16, 4) +
    '-' +
    hex.substr(20, 12)
  )
}
