const UsersController = require('../auth/users/controllers/users.controller');
const PermissionMiddleware = require('../services/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../services/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/users', [
        UsersController.insert
    ]);
    app.get('/users', [
        ValidationMiddleware.validJWTNeeded,
        UsersController.list
    ]);
    app.get('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.getById
    ]);
    app.patch('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        UsersController.patchById
    ]);
    app.delete('/users/:userId', [
        ValidationMiddleware.validJWTNeeded,
        UsersController.removeById
    ]);
};