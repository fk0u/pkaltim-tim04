
async function main() {
    try {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'API Test User',
                email: `apitest_${Date.now()}@example.com`,
                password: 'password123'
            })
        });

        console.log(`Status: ${res.status}`);
        const data = await res.json();
        console.log('Response:', data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

main();
