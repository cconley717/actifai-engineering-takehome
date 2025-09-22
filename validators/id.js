function idValidator(req, res, next) {
  const { id } = req.params;

  const i = parseInt(id, 10);

  if (Number.isNaN(i)) {
    return res.status(400).json({ isError: true, message: 'Id must be a number.' });
  }
  else if (i <= 0) {
    return res.status(400).json({ isError: true, message: 'Id must be greater than 0.' });
  }
  else {
    next();
  }
}

module.exports = { 
    idValidator 
};
