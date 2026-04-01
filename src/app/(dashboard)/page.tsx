export default function DashboardPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Welcome to Notella</h1>
        <p className="text-muted-foreground">
          Select a module from the sidebar to begin.
        </p>
      </div>
    </div>
  );
}
