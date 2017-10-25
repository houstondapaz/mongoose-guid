# mongoose-guid
GUID type for mongoose

[![bitHound Overall Score](https://www.bithound.io/github/houstondapaz/mongoose-guid/badges/score.svg)](https://www.bithound.io/github/houstondapaz/mongoose-guid)
[![Coverage Status](https://coveralls.io/repos/github/houstondapaz/mongoose-guid/badge.svg?branch=master)](https://coveralls.io/github/houstondapaz/mongoose-guid?branch=master)
[![Build Status](https://travis-ci.org/houstondapaz/mongoose-guid.svg?branch=master)](https://travis-ci.org/houstondapaz/mongoose-guid)

# Mongoose GUID Data type

## Why
In a .NET project? Yeah .NET GUID is a UUID V3 and node do not have support to this!

## How to use

```JavaScript
const GUID = require('mongoose-guid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
  _id: { type: GUID.type, default: GUID.value },
  name: String
}, { id: false });

ProductSchema.set('toObject', {getters: true});
ProductSchema.set('toJSON', {getters: true});

const Product = mongoose.model('Product', ProductSchema);
```

## Arrays

To create arrays of GUIDs use the property ```Array```

```javascript
const ProductSchema = Schema({
  _id: { type: GUID.type, default: GUID.value },
  ids: GUID.Array
}, { id: false });
```
