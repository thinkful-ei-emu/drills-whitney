require('dotenv').config();
const knex = require('knex');
const ItemsService = require('./shopping-list-service.js');

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

ItemsService.getAllItems(db)
  .then(items => console.log(items))
  .then(() => 
    ItemsService.insertItem(db, {
      item_name: 'Bananas',
      price: '$1.00',
      checked: false,
      category: 'Breakfast',
      date_added: new Date(),
    })
  )
  .then(newItem => {
    console.log(newItem);
    return ItemsService.updateItem(db, newItem.id, {item_name: 'tacos'})
      .then(() => ItemsService.getById(db, newItem.id));
  })
  .then(item => {
    console.log(item);
    return ItemsService.deleteItem(db, item.id);
  });