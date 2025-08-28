function withCors(handler) {
  return async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        body: ''
      };
    }
    const res = await handler(event, context);
    res.headers = Object.assign({}, res.headers, {
      'Access-Control-Allow-Origin': '*'
    });
    return res;
  };
}
module.exports = { withCors };
