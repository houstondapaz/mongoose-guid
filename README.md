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
var GUID = require('mongoose-guid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
  _id: { type: GUID.type, default: GUID.value },
  name: String
}, { id: false });

ProductSchema.set('toObject', {getters: true});
ProductSchema.set('toJSON', {getters: true});

var Product = mongoose.model('Product', ProductSchema);


```

```
