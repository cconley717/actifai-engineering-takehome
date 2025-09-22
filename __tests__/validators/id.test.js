const { idValidator } = require('../../validators/id');

function mockRes() {
  const res = {};
  
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);

  return res;
}

describe('idValidator middleware', () => {
  test('calls next() for positive integer id', () => {
    const req = { params: { id: '42' } };
    const res = mockRes();
    const next = jest.fn();

    idValidator(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(req.params.id).toBe('42');
  });

  test('400 when id is not a number', () => {
    const req = { params: { id: 'abc' } };
    const res = mockRes();
    const next = jest.fn();

    idValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ isError: true, message: 'Id must be a number.' });
  });

  test('400 when id <= 0', () => {
    const req = { params: { id: '0' } };
    const res = mockRes();
    const next = jest.fn();

    idValidator(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ isError: true, message: 'Id must be greater than 0.' });
  });
});
