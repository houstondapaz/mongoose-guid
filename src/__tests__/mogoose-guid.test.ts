import mongoose from 'mongoose'
import MongooseGuid from '../mongoose-guid'
import { Guid as GUID } from 'guid-typescript'

describe('mongoose-guid', () => {
  const val = GUID.create()

  const Guid = MongooseGuid(mongoose)
  const ProductSchema = new mongoose.Schema(
    {
      _id: { type: mongoose.Types.Guid, default: GUID.create() },
      name: String,
    },
    { id: false },
  )

  ProductSchema.set('toObject', { getters: true })
  ProductSchema.set('toJSON', { getters: true })

  const Product = mongoose.model('products', ProductSchema)

  beforeAll(() => mongoose.connect('mongodb://127.0.0.1:27017/tests'))

  afterAll(() => Product.remove({}).then(() => mongoose.disconnect()))

  it('for each object the _id is different', function () {
    const product = new Product({ name: 'Some product' })
    const product2 = new Product({ name: 'Some product' })
    console.log('product', product)
    console.log('product2', product2)
    expect(product._id).not.toEqual(product2._id)
  })
})
