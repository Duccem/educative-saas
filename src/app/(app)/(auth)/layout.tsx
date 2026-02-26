export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary ">
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 rounded-sm bg-primary"></div>
            </div>
            <h1 className="text-xl font-semibold text-white">AcadAI</h1>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">
              Effortlessly manage your school with AI-powered tools
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Log in to access your personalized dashboard, where you can manage
              courses, track student progress, and communicate with teachers and
              students all in one place.
            </p>
          </div>

          <div className="flex justify-between items-center text-white/70 text-sm">
            <span>Copyright © 2025 AcadAI Enterprises LTD.</span>
            <span className="cursor-pointer hover:text-white/90">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 flex-col">
        <div className="w-full  space-y-8">
          <div className="   text-center mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-3 bg-primary">
              <div className="w-4 h-4 bg-background rounded-sm"></div>
            </div>
            <h1 className="text-xl font-semibold text-foreground">AcadAI</h1>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

