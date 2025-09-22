const { yearMonthValidator } = require('../../validators/yearMonth');

function mockRes() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe('yearMonthValidator middleware', () => {
  test('400 when year is missing', () => {
    const req = { query: { month: '5' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Year is absent from the query.',
    });
  });

  test('400 when month is missing', () => {
    const req = { query: { year: '2021' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Month is absent from the query.',
    });
  });

  test('400 when year or month not numbers', () => {
    const req = { query: { year: 'abcd', month: '11' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Year and month parameters must be numbers.',
    });
  });

  test('400 when year < 1', () => {
    const req = { query: { year: '0', month: '6' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Invalid year, must be greater than 0.',
    });
  });

  test('400 when month < 1', () => {
    const req = { query: { year: '2021', month: '0' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Invalid month, must be between 1 and 12, inclusive.',
    });
  });

  test('400 when month > 12', () => {
    const req = { query: { year: '2021', month: '13' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      isError: true,
      message: 'Invalid month, must be between 1 and 12, inclusive.',
    });
  });

  test('passes for valid edge values (year=1, month=1)', () => {
    const req = { query: { year: '1', month: '1' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('passes for valid values (year=2021, month=12)', () => {
    const req = { query: { year: '2021', month: '12' } };
    const res = mockRes();
    const next = jest.fn();

    yearMonthValidator(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
