const csurf = require('@dr.pogodin/csurf');

const csrfProtection = csurf();

function csrfSetup(req, res, next) {
  // libera rotas que não usam form (ex.: arquivos, GET puro etc.)
  // e garante que o body já foi parseado (você já usa express.urlencoded antes)
  csrfProtection(req, res, (err) => {
    if (err) return next(err);

    // Só gera token quando for renderizar páginas (GET) — evita token em POST/redirect
    if (req.method === 'GET') {
      res.locals.csrfToken = req.csrfToken();
    }

    next();
  });
}

module.exports = { csrfSetup };
