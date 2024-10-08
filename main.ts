const mongoose = require('mongoose');

const APP_DB_NAME = 'mongodb://localhost/lesson6';
mongoose.connect(APP_DB_NAME);

const ItemSchema = {
    'name': {
    type: String,
    required: true
    },
    'price': {
    type: Number,
    required: true
    },
    'producer': {
    type: String,
    required: false
    }
}

const Item = mongoose.model('items', new mongoose.Schema(ItemSchema))

const monitor = new Item({
    name: 'Super monitor 16k 500hz',
    price: 20000,
    producer: 'Vitalya'
});

(async function() {
    await monitor.save()
}());


const express = require('express');
const app = express();

// app.get('/', (req, res) => {
//   res.send('<style>h1 { background: red; }</style><h1>Привіт, світе!</h1>');
// });

app.listen(3000, () => {
  console.log('Сервер працює на порту 3000');
});

const bodyParser = require('body-parser');
(async function(){
    await app.use(bodyParser.json())
}());

const products = new Item(
    {
    id: 1,
    name: 'Monitor 3000 Ultra Max',
    price: 320230,
    }
);
(async function(){
    await products.save();
}());

const getProduct = async (req, res) => {
    const product = await Item.find({ _id: req.params.id });
    if (product.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
    } else{
        return res.json(product);
    }
};

const addProduct = async (req, res) => {
    res.json(await new Item(req.body).save())
}

const putProduct = async (req, res) => {
    const product = await Item.find({ _id: req.params.id});
    if (product.length === 0) return res.status(404).json({ message: 'Product not found' });
    await Item.updateOne({ _id: req.params.id }, { $set: { price: parseFloat(Number(req.body.price).toFixed(2)) } });
    res.json(product);
}

const delProduct = async (req, res) =>{
    const product = await Item.find({ _id: req.params.id});
    if (product.length === 0) return res.status(404).json({ message: 'Product not found' });
    await Item.deleteOne({ _id: req.params.id })
    res.json(product);
}

app.get('/product/:id', getProduct);
app.post('/product', addProduct);
app.put('/product/:id', putProduct);
app.delete('/product/:id', delProduct);

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // обов'язково викликати next() для продовження обробки
  };
  
  app.use(logger);