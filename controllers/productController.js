import asyncHandler from "express-async-handler";
import productModel from "../models/productModel.js";

const getProducts = asyncHandler( async (req,res) => {
    const products = await productModel.find();
    res.json({
        count: products.length,
        products: products.map(product => (
            {
                id: product._id,
                name: product.name,
                price: product.price.toLocaleString(),
                brand: product.brand,
                // img:product.img,
                desc: product.desc,
                countInStock:product.countInStock,
            }
        ))
    });
})

const getProductById = asyncHandler( async (req, res) => {

    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if(product){
        const pr = product.price.toLocaleString();
        product.price = pr;
        console.log(pr);
        res.json(product);
    }else{
        res.status(404).json({
            msg: '프로덕트 없음',
        })
    }
})

const createProduct = asyncHandler( async (req, res) => {
    const {name, price, brand, description} = req.body;
    // const imageNumber = Math.floor(Math.random() * (500 - 1) + 1);
    const newProduct = new productModel({
        name,
        price,
        brand,
        desc:description,
        // img:`https://picsum.photos/200/200/?image=${imageNumber}`,
    });

    const createdProduct = await newProduct.save();

    res.json(createdProduct);
})

const modifyProductById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const {name, price, brand, desc} = req.body;

    const product = await productModel.findById(id);
    if(product){
        product.name = name;
        product.price = price;
        product.brand = brand;
        product.desc = desc;

        const updatedProduct = await product.save();
        res.json({
            msg: 'updated at ' + id,
            updatedProduct,
        })

    }else {
        res.status(404).json({
            msg: '수정할 데이터가 없습니다.',
        })
    }
})

const deleteProducts = asyncHandler( async (req, res) => {
    await productModel.deleteMany({});
    res.json({
        msg: '프로덕트 삭제 됨',
    })
})

const deleteProductById = asyncHandler( async (req, res) => {
    const productId = req.params.id;

    const product = await productModel.findById(productId);
    if(product){
        await product.remove();
        res.json({
            msg: '프로덕트 removed',
        })
    } else{
        res.status(404).json({
            msg: '프로덕트 없음',
        })

    }
})

export {
    getProducts,
    getProductById,
    createProduct,
    modifyProductById,
    deleteProducts,
    deleteProductById
}