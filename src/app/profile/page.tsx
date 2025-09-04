'use client';

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

type Profile = {
    name: string;
    email: string;
};

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            // No token: redirect to the login page
            router.replace("/login");

            return;
        }

        const abort = new AbortController();

        (async () => {
            try {
                const res = await fetch("/api/profile", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: abort.signal,
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        // Invalid token: clear and redirect to the login page
                        localStorage.removeItem("token");
                        router.replace("/login");
                    } else {
                        setError("Error loading profile");
                    }

                    return;
                }

                const data = (await res.json()) as Profile;
                setProfile(data);
            } catch (e) {
                if (!(e instanceof DOMException && e.name === "AbortError")) {
                    setError("Error loading profile");
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => abort.abort();
    }, [router]);

    return (
        <main>
            <h1>Profile</h1>

            {loading && <p>Loading...</p>}

            {!loading && error && (
                <div style={{color: "crimson"}} role="alert">
                    {error}
                </div>
            )}

            {!loading && profile && (
                <div>
                    <div>
                        <strong>Name:</strong> {profile.name}
                    </div>

                    <div>
                        <strong>Email:</strong> {profile.email}
                    </div>
                </div>
            )}
        </main>
    );
}
