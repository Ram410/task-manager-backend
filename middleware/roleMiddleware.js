const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Access denied: No role found" });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: `Access denied: ${requiredRole} role required` });
    }

    next();
  };
};

export default checkRole;