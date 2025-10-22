import { Link } from "react-router"

import { Outlet } from "react-router"

export function Layout() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <nav className="h-[3rem] border-b flex items-center bg-white">
        <div className="flex items-center justify-between gap-2 mx-auto max-w-screen-lg w-full px-3">
          <Link to="/" className="font-medium">
            Construct Flow
          </Link>
        </div>
      </nav>
      <main className="p-3 mx-auto max-w-screen-lg">
        <Outlet />
      </main>
    </div>
  )
}
