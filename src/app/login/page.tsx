'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault();
        setError(null);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            });

            if (!res.ok) {
                if (res.status === 401) {
                    setError('Invalid username or password');
                } else {
                    setError('Login failed');
                }

                return;
            }

            const data = (await res.json()) as { token?: string };

            if (data.token) {
                // Successfully received token - store and redirect to the profile page

                localStorage.setItem('token', data.token);
                router.push('/profile');
            } else {
                setError('No token received');
            }
        } catch (err) {
            setError('Error');
        }
    }

    return (
        <main>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    <div>Username</div>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>

                <label>
                    <div>Password</div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                {error && (
                    <div style={{color: 'crimson'}} role="alert">
                        {error}
                    </div>
                )}

                <button type="submit">Login</button>
            </form>
        </main>
    );
}
