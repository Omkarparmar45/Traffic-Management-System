(async () => {
  const payload = {
    plateNumber: "TEST 01 UPDATED",
    type: "Car",
    ownerName: "Tester2",
    registeredDate: "2024-04-26",
    status: "Inactive"
  };

  try {
    const res = await fetch('http://localhost:8080/api/vehicles/1', {
      method: 'PUT',
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
