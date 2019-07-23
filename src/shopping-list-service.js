// Should contain methods for CRUD: to GET, INSERT, UPDATE
// and DELETE shopping list items.

const ItemsService = {

  // READ - Get all shopping list items
  getAllItems(db) {
    return db('shopping_list').select('*');
  },

  getById(db, id) {
    return db('shopping_list').select('*').where('id', id).first();
  },

  // CREATE - Insert item into shopping list
  insertItem(db, newItem) {
    return db('shopping_list')
      .insert(newItem)
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  // UPDATE - Updates item in shopping list
  updateItem(db, id, newData) {
    return db('shopping_list')
      .where('id', id)
      .update(newData);
  },

  // DELETE - Deletes item from shopping list
  deleteItem(db, id) {
    return db('shopping_list')
      .where('id', id)
      .delete();
  }
};

module.exports = ItemsService;
