require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

// DRILL 1:
// Get all items that contain text

// (1) A function that takes one parameter for 
// searchTerm which will be any string

// (2) The function will query the shopping_list 
//table using Knex methods and select the rows 
//which have a name that contains the searchTerm using 
//a case insensitive match.

function getAllText(searchTerm) {
  knexInstance('shopping_list')
    .select('*')
    .where('item_name', 'ILIKE', `%${searchTerm}%`)
    .then(res => console.log(res))
    .catch(error => console.log(error, error.message))
    .finally(() => knexInstance.destroy());
}

getAllText('kale');

// DRILL 2:
// Get all items paginated

// A function that takes one parameter for pageNumber which 
// will be a number

// The function will query the shopping_list table using Knex 
// methods and select the pageNumber page of rows paginated 
// to 6 items per page.

function getAllPaginated(pageNumber) {
  if (typeof pageNumber === 'number' && pageNumber > 0) {
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber -1);

    knexInstance('shopping_list')
      .select('item_name', 'price', 'category', 'checked', 'date_added')
      .limit(productsPerPage)
      .offset(offset)
      .then(res => console.log(res))
      .catch(error => console.log(error, error.message))
      .finally(() => knexInstance.destroy());
  } else {
    console.log('Invalid Page Number');
  }
}

getAllPaginated(3);

// DRILL 3:
// Get all items added after date

// A function that takes one parameter for daysAgo which will 
// be a number representing a number of days.

// This function will query the shopping_list table using Knex 
// methods and select the rows which have a date_added that 
// is greater than the daysAgo.

function getItemsByDateAdded(daysAgo) {
  if (typeof daysAgo === 'number' && daysAgo >= 0) {
    knexInstance('shopping_list')
      .select('*')
      .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo) )
      .then(res => console.log(res))
      .catch(error => console.log(error, error.message))
      .finally(() => knexInstance.destroy());
  } else {
    console.log('Invalid number of days');
  }
}

getItemsByDateAdded(3);


// DRILL 4:
// Get the total cost for each category

// A function that takes no parameters
// The function will query the shopping_list table using 
// Knex methods and select the rows grouped by their category 
// and showing the total price for each category.

function totalCostForCategory() {
  knexInstance('shopping_list')
    .select('category')
    .sum('price as total')
    .groupBy('category')
    .then(res => console.log(res))
    .catch(error => console.log(error.message))
    .finally(() => knexInstance.destroy());
}

totalCostForCategory();