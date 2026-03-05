import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BrainCircuit } from "lucide-react";

const AdminLoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://127.0.0.1:8000/api/v1/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // If backend provides a token, use that. Otherwise use "true".
                localStorage.setItem("admin-token", data.admin?.token || "true");
                navigate("/admin/dashboard");
            } else {
                setError(data.detail || data.message || "Invalid admin username or password.");
            }
        } catch (err) {
            console.error(err);
            setError("Could not connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />

            <div className="w-full max-w-md bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-2xl relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 border border-primary/30">
                        <BrainCircuit className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">Admin Login</h1>
                    <p className="text-muted-foreground text-sm mt-1">Sign in to manage the question bank</p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6 bg-destructive/10 text-destructive border-destructive/20">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter admin username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="bg-background/50"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-background/50"
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
