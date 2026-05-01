const url = 'https://task-manager-backend-production-e42d.up.railway.app';
const id = '69f390c80ecd6227c2977d99';
const candidates = [
  { url: `${url}/api/projects/${id}`, method: 'DELETE' },
  { url: `${url}/api/project/${id}`, method: 'DELETE' },
  { url: `${url}/api/projects?id=${id}`, method: 'DELETE' },
  { url: `${url}/api/project?id=${id}`, method: 'DELETE' },
  { url: `${url}/api/projects/remove/${id}`, method: 'DELETE' },
  { url: `${url}/api/projects/delete/${id}`, method: 'DELETE' },
  { url: `${url}/api/projects/remove`, method: 'POST', body: { id } },
  { url: `${url}/api/projects/delete`, method: 'POST', body: { id } },
  { url: `${url}/api/projects`, method: 'POST', body: { action: 'delete', id } },
  { url: `${url}/api/project`, method: 'POST', body: { action: 'delete', id } }
];

(async () => {
  for (const c of candidates) {
    const opts = { method: c.method, headers: { 'Content-Type': 'application/json' } };
    if (c.body) opts.body = JSON.stringify(c.body);
    try {
      const res = await fetch(c.url, opts);
      const text = await res.text();
      console.log(`${c.method} ${c.url} => ${res.status}`);
      console.log(text.slice(0, 200));
    } catch (e) {
      console.error('ERR', c.method, c.url, e.message);
    }
  }
})();
