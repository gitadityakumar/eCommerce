const merchantTransactionId = process.argv[2];

if (!merchantTransactionId) {
  console.error('Usage: npx tsx simulate_webhook.js <merchantTransactionId>');
  process.exit(1);
}

async function simulate() {
  const payload = {
    code: 'PAYMENT_SUCCESS',
    data: {
      merchantTransactionId,
      transactionId: `T${Date.now()}`,
      amount: 125000,
      state: 'COMPLETED',
    },
  };

  console.warn('Simulating Webhook for:', merchantTransactionId);

  try {
    const response = await fetch('http://localhost:3000/api/webhooks/phonepe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.warn('Webhook Response:', response.status, result);
  }
  catch (err) {
    console.error('Failed to simulate webhook:', err);
  }
}

simulate();
