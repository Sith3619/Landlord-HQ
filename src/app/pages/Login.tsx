import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Welcome back!");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-green-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">Landlord HQ</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-foreground">Sign in to your account</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your properties in one place</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10"
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-green-600 hover:bg-green-700 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-5">
            {"Don't have an account? "}
            <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
