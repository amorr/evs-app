import moment from "moment"
import path from 'path'

const isBuild = process.env.NODE_ENV === 'production'
/* global __static */
const pathToDbFile = path.join(
  (isBuild ? __dirname : __static),
  (isBuild ? '../../' : ''),
  'base.db'
)

const sqlite3 = require('sqlite3').verbose()
let db
console.log(pathToDbFile)
// 连接数据库
function conn() {
  if (!db || !db.open) {
    db = new sqlite3.Database(pathToDbFile)
  }
  return db
}

// 初始化数据表
export const initTable = () => {
  return new Promise((resolve) => {
    let db = conn()
    db.serialize(() => {
      db.run('CREATE TABLE if not exists products (id INTEGER, productName varchar(64) UNIQUE, unitId int,inventory decimal(10,2),inventoryReceived decimal(10,2) DEFAULT 0,inventoryShipped decimal(10,2) DEFAULT 0,total decimal(10,2), PRIMARY KEY(id AUTOINCREMENT))')
      db.run('CREATE TABLE IF NOT EXISTS unit (id INTEGER, unitName varchar(64) UNIQUE,decimalAllowed int, PRIMARY KEY(id AUTOINCREMENT))')
      db.run('CREATE TABLE IF NOT EXISTS category ( id	INTEGER, categoryName	varchar(64) UNIQUE, PRIMARY KEY(id AUTOINCREMENT) )')
      db.run('CREATE TABLE IF NOT EXISTS categoryProduct (id INTEGER, categoryId int,productId int, PRIMARY KEY(id AUTOINCREMENT))')
      db.run('CREATE TABLE IF NOT EXISTS purchase (id INTEGER, productId int, numberRecived decimal(10,2), costs decimal(10,2), purchaseDate INTEGER, PRIMARY KEY(id AUTOINCREMENT))')
      db.run('CREATE TABLE IF NOT EXISTS orders (id INTEGER, productId int, numberConsumed decimal(10,2), "avgPrice"	decimal(10, 2), orderDate INTEGER, PRIMARY KEY(id AUTOINCREMENT))')
      resolve()
    })
  })
}

export const queryAllUnit = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select id, unitName, decimalAllowed from unit', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const insertUnit = (unitname, decimalAllowed) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('insert into unit (unitname, decimalAllowed) values (?, ?)')
    prepare.run(unitname, decimalAllowed, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const checkUnit = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select productName from products where unitId in (' + placeholders + ')', ids, (err, rows) => {
      if (err) reject(err)
      if (rows.length > 0) reject(rows)
      resolve()
    })
  })
}

export const deleteUnit = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from unit where id in (' + placeholders + ')')
    prepare.run(...ids, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const updateUnit = (id, unitname, decimalAllowed) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('update unit set unitName = ? ,decimalAllowed = ? where id = ?')
    prepare.run(unitname, decimalAllowed, id, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const getUnit = (unitId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.get('select id, unitName, decimalAllowed from unit where id = ?', unitId, (err, row) => {
      if (err) reject(err)
      resolve(row || null)
    })
  })
}

export const queryAllCategory = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select id, categoryName from category', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const getCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.get('select id, categoryName from category where id = ?', categoryId, (err, row) => {
      if (err) reject(err)
      resolve(row || null)
    })
  })
}

export const queryAllCategoryWithProduct = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('SELECT p.productName, p.id productId, u.unitName,u.decimalAllowed, c.categoryName, c.id categoryId FROM products p, unit u, category c, categoryProduct cp where p.unitId = u.id and cp.categoryId = c.id and cp.productId = p.id ORDER by categoryId', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const queryAllProductInCategoryByCategorytId = (categoryId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('SELECT p.productName, p.id productId FROM products p, categoryProduct cp where cp.categoryId = ? and cp.productId = p.id ', categoryId, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const insertCategory = (categoryname) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('insert into category (categoryname) values (?)')
    prepare.run(categoryname, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (err) reject(err)
      resolve()
    })
  })
}

export const updateCategory = (categoryName, categoryId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('update category set categoryName = ? where id=?')
    prepare.run(categoryName, categoryId, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteCategory = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  // let params = ids.map((id)=>id).join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from category where id in (' + placeholders + ')')
    prepare.run(...ids, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteProductFromCategory = (ids, categoryId) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from categoryProduct where productId in (' + placeholders + ') and categoryId = ?')
    prepare.run(...ids, categoryId, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteCategoryProduct = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from categoryProduct where categoryId in (' + placeholders + ')')
    prepare.run(...ids, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteProductCategoryByProductId = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from categoryProduct where productId in (' + placeholders + ')')
    prepare.run(...ids, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const deleteProduct = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from products where id in (' + placeholders + ')')
    prepare.run(...ids, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const queryAllProduct = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select p.id, p.productName, u.unitName as unit, p.inventory, p.inventoryReceived, p.inventoryShipped, p.total from products as p, unit as u  where u.id = p.unitId', (err, rows) => {
      if (err) reject(err)

      resolve(rows || [])
    })
  })
}

export const queryRelatedCategoryByProductId = (id) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select c.id, c.categoryName from category as c, categoryProduct as cp  where cp.productId = ? and cp.categoryid = c.id', id, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const queryProduct = (id) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.get('select p.id, p.productName, p.unitId, u.unitName as unit, u.decimalAllowed , p.inventory, p.inventoryReceived, p.inventoryShipped, p.total from products as p, unit as u  where u.id = p.unitId and p.id = ?', id, (err, row) => {
      if (err) reject(err)
      resolve(row || [])
    })
  })
}

export const updateProduct = (formData, id) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('update products set productName = ?, unitId = ?, inventory=?, total=? where id=?')
    prepare.run(formData.productname, formData.unit, formData.productNumber, formData.productValue, id, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const queryAllProductByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select id, productName from products where id not in ( select productId from categoryProduct where categoryId = ? )', categoryId, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const addProductToCategory = (productIds, categoryId) => {
  let placeholders = productIds.map(() => '(?,?)').join(',')
  let params = productIds.map((productId) => { return [productId, categoryId] }).flat()
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('insert into categoryProduct (productId, categoryId) values ' + placeholders)
    prepare.run(...params, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) {
        resolve()
      }
    })
  })
}

export const insertNewProduct = (formData) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('insert into products (productName, unitId, inventory, total) values (?, ?, ?, ?)')
    prepare.run(formData.productname, formData.unit, formData.productNumber, formData.productValue, function (err) {
      if (err) throw err;
      // console.log(this.lastID)
      if (this.lastID) {
        let placeholders = formData.category.map(() => '(?, ?)').join(',')
        let sql = 'insert into categoryProduct (categoryId, productId) values ' + placeholders
        let values = []
        for (let index = 0; index < formData.category.length; index++) {
          const element = formData.category[index];
          values.push(element)
          values.push(this.lastID)
        }
        // console.log(sql)
        // console.log(values)
        db.run(sql, values, function (err) {
          if (err) console.log(err)
        })
      }
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const addProductToManyCategory = (productId, categoryIds) => {
  let placeholders = categoryIds.map(() => '(?,?)').join(',')
  let params = categoryIds.map((categoryId) => { return [productId, categoryId] }).flat()
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('insert into categoryProduct (productId, categoryId) values ' + placeholders)
    prepare.run(...params, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) {
        resolve()
      }
    })
  })
}

export const insertOrder = (order) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('insert into orders (productId, numberConsumed, orderDate, avgPrice) values (?, ?, ?, ?)')
    prepare.run(order.productId, order.productNumber, order.time, order.avgPrice)
    prepare.finalize(err => {
      if (!err) {
        resolve()
      } else {
        console.log(err)
      }
    })
  })
}

export const increaseInventory = (purchase) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('update products set inventory=inventory + ?, inventoryReceived= inventoryReceived+1, total=total+? where id=?')
    prepare.run(purchase.productNumber, purchase.cost, purchase.productId)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const reduceinventory = (order) => {
  return new Promise((resolve) => {
    let db = conn()
    let prepare = db.prepare('update products set inventory=inventory - ?, inventoryShipped= inventoryShipped+1, total=ROUND(cast(total as float) * (inventory - ?) / inventory, 2) where id=?')
    prepare.run(order.productNumber, order.productNumber, order.productId)
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const insertPurchase = (purchase) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('insert into purchase (productId, numberRecived, costs, purchaseDate) values (?, ?, ?, ?)')
    prepare.run(purchase.productId, purchase.productNumber, purchase.cost, purchase.time)
    // console.log(purchase)
    prepare.finalize(err => {
      if (!err) {
        resolve()
      } else {
        reject(err)
        console.log(err)
      }
    })
  })
}

export const queryAllPurchase = (params = {}) => {
  let offset = (params.page - 1) * params.results
  let keywords = params.sortOrder == 'descend' ? 'DESC' : 'ASC'
  let sql = 'select pu.id, p.productName, pu.numberRecived, pu.costs, pu.purchaseDate from purchase as pu, products as p where p.id = pu.productId'
  if ('productName' in params) {
    sql = sql + ' and p.productName like \'%' + params.productName + '%\' '
  }
  if (params.dateLimit.length > 0) {
    sql = sql + ' and pu.purchaseDate > ' + params.dateLimit[0] + ' and pu.purchaseDate < ' + params.dateLimit[1]
  }
  sql = sql + ' order by ' + params.sortField + ' ' + keywords
  sql = sql + ' limit ' + params.results + ' offset ' + offset
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all(sql, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const deletePurchase = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from purchase where id in (' + placeholders + ')')
    prepare.run(...ids, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const getPurchaseTotal = (params = {}) => {
  let sql = 'select count(*) as total, ROUND(sum(costs),2) as summary from purchase'
  if ('productName' in params) {
    sql = 'select count(pu.id) as total, ROUND(sum(pu.costs),2) as summary from purchase as pu, products as p where p.id = pu.productId and p.productName like \'%' + params.productName + '%\''
  }
  if (params.dateLimit.length > 0) {
    if ('productName' in params == false) {
      sql = sql + ' where purchaseDate > ' + params.dateLimit[0] + ' and purchaseDate < ' + params.dateLimit[1]
    } else {
      sql = sql + ' and pu.purchaseDate > ' + params.dateLimit[0] + ' and pu.purchaseDate < ' + params.dateLimit[1]
    }
  }
  return new Promise((resolve, reject) => {
    let db = conn()
    db.get(sql, (err, row) => {
      if (err) reject(err)
      resolve(row || null)
    })
  })
}

export const getPurchase = (purchaseId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.get('select * from purchase where id = ?', purchaseId, (err, row) => {
      if (err) reject(err)
      resolve(row || null)
    })
  })
}

export const queryAllOrder = (params = {}) => {
  let offset = (params.page - 1) * params.results
  let keywords = params.sortOrder == 'descend' ? 'DESC' : 'ASC'
  let sql = 'select o.id, p.productName, o.numberConsumed,o.avgPrice, o.orderDate from orders as o, products as p where p.id = o.productId'
  if ('productName' in params) {
    sql = sql + ' and p.productName like \'%' + params.productName + '%\' '
  }
  if (params.dateLimit.length > 0) {
    sql = sql + ' and o.orderDate > ' + params.dateLimit[0] + ' and o.orderDate < ' + params.dateLimit[1]
  }
  sql = sql + ' order by ' + params.sortField + ' ' + keywords
  sql = sql + ' limit ' + params.results + ' offset ' + offset
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all(sql, (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const deleteOrder = (ids) => {
  let placeholders = ids.map(() => '?').join(',')
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('delete from orders where id in (' + placeholders + ')')
    prepare.run(...ids, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const getOrderTotal = (params = {}) => {
  let sql = 'select count(*) as total, ROUND(sum(avgPrice),2) as summary from orders'
  if ('productName' in params) {
    sql = 'select count(o.id) as total, ROUND(sum(avgPrice),2) as summary from orders as o, products as p where p.id = o.productId and p.productName like \'%' + params.productName + '%\''
  }
  if (params.dateLimit.length > 0) {
    if ('productName' in params == false) {
      sql = sql + ' where orderDate > ' + params.dateLimit[0] + ' and orderDate < ' + params.dateLimit[1]
    } else {
      sql = sql + ' and o.orderDate > ' + params.dateLimit[0] + ' and o.orderDate < ' + params.dateLimit[1]
    }
  }
  return new Promise((resolve, reject) => {
    let db = conn()
    db.get(sql, (err, row) => {
      if (err) reject(err)
      resolve(row || null)
    })
  })
}

export const restoreInventory = (order) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    let prepare = db.prepare('update products set inventory=inventory + ?, inventoryShipped= inventoryShipped-1, total=ROUND(cast(total as float) * (inventory + ?) / inventory , 2) where id=?')
    prepare.run(order.productNumber, order.productNumber, order.productId, (err) => {
      if (err) reject(err)
    })
    prepare.finalize(err => {
      if (!err) resolve()
    })
  })
}

export const getOrder = (orderId) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.get('select * from orders where id = ?', orderId, (err, row) => {
      if (err) reject(err)
      resolve(row || null)
    })
  })
}

export const getTotalByCategory = () => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.all('select sum(p.total) as total , c.categoryName from products as p, category as c, categoryProduct as cp where cp.productId = p.id and cp.categoryId = c.id GROUP by c.categoryName', (err, rows) => {
      if (err) reject(err)
      resolve(rows || [])
    })
  })
}

export const queryOrderByDay = (startPoint, endPoint) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      let prepare = db.prepare('select round(sum(avgPrice * numberConsumed),2) as summary from orders where orderDate > ? and orderDate < ?')
      let startDay = moment(startPoint * 1000).startOf("day")
      let endDay = moment(startPoint * 1000).endOf("day")
      let finalDay = moment(endPoint * 1000).endOf("day")
      let results = []
      let days = []
      // console.log(startDay.unix(), endDay.unix(), finalDay.unix())
      for (; endDay <= finalDay; startDay.add(1, "days"), endDay.add(1, "days")) {
        prepare.get(startDay.unix(), endDay.unix(), (err, row) => {
          if (err) reject(err)
          results.push(row.summary || 0)
        })
        days.push(startDay.format('M/D'))
      }
      prepare.finalize(err => {
        if (!err) resolve({ results: results, days: days })
      })
    })
  })
}

export const queryInventoryByDay = (startPoint, endPoint) => {
  return new Promise((resolve, reject) => {
    let db = conn()
    db.serialize(() => {
      let prepare = db.prepare('select round(sum(costs),2) as summary from purchase where purchaseDate > ? and purchaseDate < ?')
      let startDay = moment(startPoint * 1000).startOf("day")
      let endDay = moment(startPoint * 1000).endOf("day")
      let finalDay = moment(endPoint * 1000).endOf("day")
      let results = []
      let days = []
      // console.log(startDay.unix(), endDay.unix(), finalDay.unix())
      for (; endDay <= finalDay; startDay.add(1, "days"), endDay.add(1, "days")) {
        prepare.get(startDay.unix(), endDay.unix(), (err, row) => {
          if (err) reject(err)
          results.push(row.summary || 0)
        })
        days.push(startDay.format('M/D'))
      }
      prepare.finalize(err => {
        if (!err) resolve({ results: results, days: days })
      })
    })
  })
}




