function yearMonthValidator(req, res, next) {
  const { year, month } = req.query;

  if (year == null) { 
    return res.status(400).json({ isError: true, message: 'Year is absent from the query.' });
  }
  else if (month == null) {
    return res.status(400).json({ isError: true, message: 'Month is absent from the query.' });
  }
  else {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);

    if (Number.isNaN(y) || Number.isNaN(m)) {
        return res.status(400).json({ isError: true, message: 'Year and month parameters must be numbers.' });
    }
    if (y < 1) {
        return res.status(400).json({ isError: true, message: 'Invalid year, must be greater than 0.' });
    }
    else if (m < 1 || m > 12) {
        return res.status(400).json({ isError: true, message: 'Invalid month, must be between 1 and 12, inclusive.' });
    }
    else {
        next();
    }
  }
}

module.exports = { 
    yearMonthValidator 
};
