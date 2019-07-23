const ItemsService = require('../src/shopping-list-service');
const knex = require('knex');

// Tests in here test the CRUD methods

describe('Items service object', () => {
  let db;

  let testItems = [
    {
      item_name: 'Bananas',
      price: '$1.00',
      checked: false,
      category: 'Breakfast',
      date_added: new Date(),
      id: 1
    },
    {
      item_name: 'Peas',
      price: '$5.00',
      checked: true,
      category: 'Lunch',
      date_added: new Date(),
      id: 2
    },
    {
      item_name: 'Donut',
      price: '$12.00',
      checked: false,
      category: 'Snack',
      date_added: new Date(),
      id: 3
    }
  ];

  // Establish database connection
  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  // Delete any instance of shopping_list table
  before(() => db('shopping_list').truncate());

  // Delete any instance of shopping_list table after each test
  afterEach(() => db('shopping_list').truncate());

  // Destroy database connection
  after(() => db.destroy());

  // ========== TESTS - READ ==========
  // WITH DATA
  context('Given \'shopping_list\' has data', () => {
    // Insert test data into table
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });

    // getAllItems gets all items from the shopping list table
    it('getAllItems() resolves all items from shopping_list', () => {
      return ItemsService.getAllItems(db)
        .then(res => {
          expect(res).to.eql(testItems);
        });
    });

    // getById gets an item by id from the shopping list table
    it('getById() resolves an item by id from shopping list', () => {
      const testId = 3;
      const thirdItem = testItems[testId - 1];
      return ItemsService.getById(db, testId)
        .then(actual => {
          expect(actual).to.eql({
            id: testId,
            item_name: thirdItem.item_name,
            price: thirdItem.price,
            checked: thirdItem.checked,
            category: thirdItem.category,
            date_added: thirdItem.date_added
          });
        });
    });

  });

  //WITHOUT DATA
  context('Given shopping_list has no data', () => {

    // getAllItems returns an empty array when there is no data
    it('getAllItems() resolves an empty array', () => {
      return ItemsService.getAllItems(db)
        .then(res => {
          expect(res).to.eql([]);
        });
    });
  });

  // ========== TESTS - CREATE ==========
  // WITH DATA
  context('Given data', () => {
    it('insertItem() inserts an article and resolves the item with an id', () => {
      // create new item to insert
      const newItem = {
        item_name: 'Steak',
        price: '$20.00',
        checked: false,
        category: 'Main',
        date_added: new Date(),
      };

      return ItemsService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            item_name: newItem.item_name,
            price: newItem.price,
            checked: newItem.checked,
            category: newItem.category,
            date_added: newItem.date_added
          });
        });
    });
  });

  // WITHOUT DATA

  // ========== TESTS - UPDATE ==========
  // WITH DATA
  context('Given data', () => {
    // Insert test data into table
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });

    it('updateItem updates an item with specific id from shopping list table', () => {
      const testId = 3;
      const newData = {
        item_name: 'ice cream',
        price: '$3.00',
        category: 'Snack',
        checked: true,
        date_added: new Date()
      };

      return ItemsService.updateItem(db, testId, newData)
        .then(() => ItemsService.getById(db, testId))
        .then(item => {
          expect(item).to.eql({
            id: testId,
            ...newData,
          });
        });
    });
  });

  // ========== TESTS - DELETE ==========
  // WITH DATA
  context('Given data', () => {
    // Insert test data into table
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testItems);
    });

    it('deleteItem removes an item by id from shopping list table', () => {
      const testId = 3;
      return ItemsService.deleteItem(db, testId)
        .then(() => ItemsService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== testId);
          expect(allItems).to.eql(expected);
        });
    });
  });
});