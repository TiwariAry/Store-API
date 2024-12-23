const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({featured: true});
    res.status(200).json({msg: products, nbHits: products.length});
}

const getAllProducts = async (req, res) => {
    // To filter out the useful keys
    const queryObject = extract(req);

    let result = Product.find(queryObject);

    // Sort filter
    if (req.query.sort) { // Since using static access, here 'sort' is a name
        result = result.sort(req.query.sort.split(',').join(' '));
    }
    else {
        result = result.sort('createdAt');
    }

    // Page setter
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    // Fields filter
    if (req.query.field) {
        result = result.select(req.query.field.split(',').join(' '));
    }

    // Price range filter
    if (req.query.numericFilters) {
        const operatorMap = {
            '=': '$eq',
            '>': '$gt',
            '<': '$lt',
            '>=': '$gte',
            '<=': '$lte'
        }

        const regEx = /\b(=|<|>|<=|>=)\b/g;
        let filters = req.query.numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        );

        const options = ['price', 'rating'];
        filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = {[operator]: Number(value)};
            }
        });
    }

    const products = await result;
    res.status(200).json({products: products, amount: products.length});
}

function extract(req) {
    const queryObject = {};

    for (let key of Object.keys(Product.schema.obj)) {
        // Since using dynamic access, here 'key' is a variable
        if (req.query[key] === undefined) continue

        if (key === 'name') queryObject[key] = {$regex: req.query[key], $options: 'i'};
        else queryObject[key] = req.query[key];
    }

    return queryObject;
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}