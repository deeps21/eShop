const VALIDATOR = require('validator');
const product = require('mongoose').model('product');
const USER = require('mongoose').model('User');

const PAGE_LIMIT = 15;

function validateproductForm(payload) {
    let errors = {};
    let isFormValid = true;

    if (!payload || typeof payload.title !== 'string' || payload.title.trim().length === 0) {
        isFormValid = false;
        errors.title = 'Please provide title.';
    }

    if (!payload || typeof payload.author !== 'string' || payload.author.trim().length === 0) {
        isFormValid = false;
        errors.author = 'Please provide author.';
    }

    if (!payload || typeof payload.genre !== 'string' || payload.genre.trim().length === 0) {
        isFormValid = false;
        errors.genre = 'Please provide genre.';
    }

    if (!payload || isNaN(Number(payload.year))) {
        isFormValid = false;
        errors.year = 'Please provide manufacture year.';
    }

    if (!payload || typeof payload.description !== 'string' || payload.description.trim().length < 10) {
        isFormValid = false;
        errors.description = 'Description must be at least 10 symbols long.';
    }

    if (!payload || !payload.cover || !VALIDATOR.isURL(payload.cover)) {
        isFormValid = false;
        errors.cover = 'Please provide proper url for the product image';
    }

    if (!payload || !payload.isbn || !VALIDATOR.isISBN(payload.isbn)) {
        isFormValid = false;
        errors.isbn = 'Please provide a valid serial number.';
    }

    if (!payload || isNaN(Number(payload.pagesCount)) || payload.pagesCount === '') {
        isFormValid = false;
        errors.pagesCount = 'Please provide weight in grams';
    }

    if (!payload || isNaN(Number(payload.price)) || Number(payload.price) < 0 || payload.pagesCount === '') {
        isFormValid = false;
        errors.price = 'Please provide product price.';
    }

    return {
        success: isFormValid,
        errors
    };
}

function validateRatingForm(payload) {
    let errors = {};
    let isFormValid = true;

    if (
        !payload
        || isNaN(Number(payload.rating))
        || !VALIDATOR.isInt(payload.rating.toString())
        || Number(payload.rating) < 1
        || Number(payload.rating) > 5
    ) {
        isFormValid = false;
        errors.price = 'Rating must be a integer number between 1 and 5.';
    }

    return {
        success: isFormValid,
        errors
    };
}

module.exports = {
    getSingle: (req, res) => {
        let productId = req.params.productId;

        product.findById(productId)
            .then((product) => {
                if (!product) {
                    return res.status(400).json({
                        message: 'There is no product with the given id in our database.'
                    });
                }

                return res.status(200).json({
                    message: '',
                    data: product
                });
            })
            .catch((err) => {
                console.log(err);
                return res.status(400).json({
                    message: 'Something went wrong, please try again.'
                });
            });
    },

    add: (req, res) => {
        let product = req.body;

        let validationResult = validateproductForm(product);

        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Product form validation failed!',
                errors: validationResult.errors
            });
        }

        product.create(product).then((newproduct) => {
            return res.status(200).json({
                message: 'Product added successfully!',
                data: newproduct
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
    },

    edit: (req, res) => {
        let productId = req.params.productId;
        let editedproduct = req.body;

        let validationResult = validateproductForm(editedproduct);

        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Product form validation failed!',
                errors: validationResult.errors
            });
        }

        product.findById(productId).then((product) => {
            if (!product) {
                return res.status(400).json({
                    message: 'There is no product with the given id in our database.'
                });
            }

            product.title = editedproduct.title;
            product.author = editedproduct.author;
            product.genre = editedproduct.genre;
            product.year = editedproduct.year;
            product.description = editedproduct.description;
            product.cover = editedproduct.cover;
            product.isbn = editedproduct.isbn;
            product.pagesCount = editedproduct.pagesCount;
            product.price = editedproduct.price;
            product.save();

            return res.status(200).json({
                message: 'Product edited successfully!',
                data: product
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
    },

    delete: (req, res) => {
        let productId = req.params.productId;

        product.findByIdAndRemove(productId).then((deletedproduct) => {
            if (!deletedproduct) {
                return res.status(400).json({
                    message: 'There is no product with the given id in our database.'
                });
            }

            return res.status(200).json({
                message: 'Product deleted successfully.',
                data: deletedproduct
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
    },

    rate: (req, res) => {
        let productId = req.params.productId;
        let rating = req.body.rating;
        let userId = req.user.id;

        let validationResult = validateRatingForm(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Rating form validation failed!',
                errors: validationResult.errors
            });
        }

        product.findById(productId).then((product) => {
            if (!product) {
                return res.status(400).json({
                    message: 'There is no product with the given id in our database.'
                });
            }

            let ratedByIds = product.ratedBy.map((id) => id.toString());
            if (ratedByIds.indexOf(userId) !== -1) {
                return res.status(400).json({
                    message: 'You already rated this item'
                });
            }

            product.ratedBy.push(userId);
            product.ratingPoints += rating;
            product.ratedCount += 1;
            product.currentRating = product.ratingPoints / product.ratedCount;
            product.save();

            return res.status(200).json({
                message: 'You rated the item successfully.',
                data: product
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
    },

    addToFavorites: (req, res) => {
        let productId = req.params.productId;

        product.findById(productId).then((product) => {
            if (!product) {
                return res.status(400).json({
                    message: 'There is no product with the given id in our database.'
                });
            }

            USER.findById(req.user.id).then((user) => {

                let productsIds = user.favoriteproducts.map((b) => b.toString());
                if (productsIds.indexOf(productId) !== -1) {
                    return res.status(400).json({
                        message: 'You already have this product in your wish list'
                    });
                }

                user.favoriteproducts.push(product._id);
                user.save();

                return res.status(200).json({
                    message: 'Successfully added the product to your wish list.'
                });
            });
        }).catch((err) => {
            console.log(err);
            return res.status(400).json({
                message: 'Something went wrong, please try again.'
            });
        });
    },

    search: (req, res) => {
        let params = req.query;
        let searchParams = {
            query: {},
            sort: { creationDate: -1 },
            skip: null,
            limit: PAGE_LIMIT,
        };

        if (params.query || typeof params.query === 'string') {
            let query = JSON.parse(params.query);
            searchParams.query = { $text: { $search: query['searchTerm'], $language: 'en' } };
        }

        if (params.sort) {
            searchParams.sort = JSON.parse(params.sort);
        }

        if (params.skip) {
            searchParams.skip = JSON.parse(params.skip);
        }

        if (params.limit) {
            searchParams.limit = JSON.parse(params.limit);
        }

        product
            .find(searchParams.query)
            .count()
            .then((count) => {
                product
                    .find(searchParams.query)
                    .sort(searchParams.sort)
                    .skip(searchParams.skip)
                    .limit(searchParams.limit)
                    .then((result) => {
                        return res.status(200).json({
                            message: '',
                            data: result,
                            query: searchParams,
                            itemsCount: count
                        });
                    })
                    .catch(() => {
                        return res.status(400).json({
                            message: 'Bad Request!'
                        });
                    });
            });
    }
};