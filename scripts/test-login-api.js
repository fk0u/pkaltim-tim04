
async function main() {
    const email = 'apitest_1769860179417@example.com'; // Use the email from the previous step output
    const password = 'password123';

    console.log(`Attempting login for ${email}...`);

    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        console.log(`Status: ${res.status}`);
        const data = await res.json();
        if (res.ok) {
            console.log('Login Successful!');
            // console.log('User:', data.user); // Don't spam output
            console.log('Set-Cookie:', res.headers.get('set-cookie'));
        } else {
            console.log('Login Failed:', data);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

main();
