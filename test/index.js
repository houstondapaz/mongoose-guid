
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    should = require('chai').should(),
    GUID = require('../index');

var ProductSchema = Schema({
    _id: { type: GUID.type, default: GUID.value },
    name: String
}, { id: false });

ProductSchema.set('toObject', { getters: true });
ProductSchema.set('toJSON', { getters: true });

var Product = mongoose.model('products', ProductSchema);

describe('mongoose-guid', function () {
    var val = GUID.value();

    before(function () {
        return mongoose.connect('mongodb://127.0.0.1:27017/tests')
    })

    after(function (cb) {
        Product.remove({}, function () {
            mongoose.disconnect(cb);
        });
    });

    it('should cast guid strings to binary', function () {
        var product = new Product({
            name: 'Some product'
        });

        product._doc._id.sub_type.should.equal(3);
        product._doc._id._bsontype.should.equal('Binary');
    });

    it('should convert back to text with toObject()', function () {
        let val = GUID.value();
        let product = new Product({
            _id: val,
            name: 'Some product'
        });

        let productObject = product.toObject();
        productObject._id.should.equal(val)
            .and.not.equal(product._doc._id);
    });

    it('should save without errors', function (cb) {
        var product = new Product({
            _id: val,
            name: 'Some product'
        });
        product.save(cb);
    });

    it('should be found correctly with .find()', function (cb) {
        Product.findOne({ _id: val }, function (err, product) {
            product.should.not.be.null;
            var productObject = product.toObject();
            (productObject._id).should.equal(val);
            cb(err);
        });
    });

    it('should be found correctly with .findById()', function (cb) {
        Product.findById(val, function (err, product) {
            (product).should.not.be.null;
            var productObject = product.toObject();
            (productObject._id).should.equal(val);
            cb(err);
        });
    });

    describe('arrays', function () {
        var PetSchema = Schema({
            _id: { type: GUID.type, default: GUID.value },
            name: String,
        }, { id: false });

        PetSchema.set('toObject', { getters: true });
        PetSchema.set('toJSON', { getters: true });

        var PhotoSchema = Schema({
            _id: { type: GUID.type, default: GUID.value },
            filename: String,
            pets: [PetSchema]
        }, { id: false });

        PhotoSchema.set('toObject', { getters: true });
        PhotoSchema.set('toJSON', { getters: true });

        var Photo = mongoose.model('photos', PhotoSchema);

        before(function (cb) {
            var photo = new Photo({
                _id: val,
                filename: 'photo.jpg',
                pets: [{ name: 'Sammy' }]
            });

            photo.save(cb);
        })

        after(function (cb) {
            Photo.remove(cb);
        });

        it('should work', function (cb) {
            Photo.findById(val).exec(function (err, photo) {
                photo.pets.should.exist;
                photo.pets.should.be.instanceof(Array);

                let pet = photo.pets[0];
                pet._doc._id.sub_type.should.equal(3);
                pet._doc._id._bsontype.should.equal('Binary');

                pet._id.should.have.lengthOf(GUID.value().length);

                cb(err);
            });
        });
    });
});
