const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "No estás autenticado");
		res.redirect("/login");
	}
};

helpers.verifyNotAuthenticated = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error_msg", "Ya estás autenticado");
		res.redirect("/");
	}
};

helpers.isAdmin = (req, res, next) => {
	if (req.user.role === "ADMIN_ROLE") {
		return next();
	} else {
		req.flash("error", "Acceso no autorizado");
		res.redirect("/");
	}
};

helpers.isUser = (req, res, next) => {
	if (req.user.role === "USER_ROLE") {
		return next();
	} else {
		req.flash("error", "Solo pueden acceder usuarios");
		res.redirect("/");
	}
};

module.exports = helpers;
