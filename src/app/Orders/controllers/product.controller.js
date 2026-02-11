exports.createProduct = (productService) => async (req, res, next) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || !price || stock == null) {
      return res.status(400).json({
        message: 'Invalid product data',
      });
    }

    const product = await productService.createProduct({
      name,
      price,
      stock,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (err) {
    next(err);
  }
};
