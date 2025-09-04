import Link from 'next/link';

export default function Home() {
    return (
        <main>
            <h1>Welcome to the Connexin Demo App!</h1>
            <p>
                <Link href="/login">Login</Link>
            </p>
        </main>
    );
}
