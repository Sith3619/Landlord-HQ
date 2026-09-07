import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-muted-foreground/30 select-none">
          404
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Page not found
          </h1>
          <p className="text-muted-foreground">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" asChild>
            <Link to={-1 as unknown as string}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Link>
          </Button>
          <Button asChild>
            <Link to="/dashboard">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
