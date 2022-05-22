const VerifyUserMiddleware = require('../services/middlewares/verify.user.middleware');
const AuthorizationController = require('../auth/authorization/controllers/auth.controller');
const AuthValidationMiddleware = require('../services/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {

    app.post('/auth', [
        VerifyUserMiddleware.hasAuthValidFields,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.login
    ]);
};