const authController = require('../app/http/controllers/authController')
const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const AdminOrderController = require('../app/http/controllers/admin/orderController')
const StatusController = require('../app/http/controllers/admin/statusController')


//Middlewares
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')





function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/cart', cartController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.post('/logout', authController().logout)

    app.get('/register', guest, authController().register)
    app.post('/update-cart', cartController().update)
    app.post('/register', authController().postRegister)

    //Customers ROutes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)

    //Admin Rotes
    app.get('/admin/orders', admin, AdminOrderController().index)
    app.post('/admin/order/status', admin, StatusController().update)



}



module.exports = initRoutes