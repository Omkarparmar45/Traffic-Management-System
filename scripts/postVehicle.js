(async () => {
  const payload = {
    plateNumber: "TEST 01",
    type: "Car",
    ownerName: "Tester",
    registeredDate: "2024-04-26",
    status: "Active"
  };

  try {
    const res = await fetch('http://localhost:8080/api/vehicles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.text();
    console.log('status', res.status);
    console.log(json);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
