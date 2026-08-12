(async () => {
  try {
    const res = await fetch('http://localhost:8080/api/vehicles/1', {
      method: 'DELETE'
    });
    console.log('status', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
