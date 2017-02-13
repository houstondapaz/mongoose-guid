
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

var Product = mongoose.model('_Product', ProductSchema);

describe('mongoose-guid', function () {
    var val = GUID.value();

    before(function () {
        return mongoose.connect('')
    })

    after(function (cb) {
        Product.remove({}, function () {
            mongoose.disconnect(cb);
        });
    });

    it('should cast guid strings to binary', function () {
        var product = new Product({
            _id: val,
            name: 'Some product'
        });

        (product._doc._id._bsontype == 'Binary').should.equal(true);
        (product._doc._id.sub_type == 3).should.equal(true);
    });

    it('should convert back to text with toObject()', function () {
        var product = new Product({
            _id: val,
            name: 'Some product'
        });
        var productObject = product.toObject();
        (productObject._id).should.equal(val);
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
            (product).should.not.be.null;
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

        var Photo = mongoose.model('_Photo', PhotoSchema);

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
                (photo.pets).should.exist;
                (photo.pets[0].name).should.equal('Sammy');
                cb(err);
            });
        });
    });
});
