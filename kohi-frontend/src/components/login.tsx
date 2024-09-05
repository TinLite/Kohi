import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer"

const LoginDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Login
      </DrawerTrigger>
      <DrawerContent className="p-6 bg-gray-100 shadow-lg rounded-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">Login</h2>
        <form action="" className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Tài khoản:
            </label>
            <input
              type="text" 
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              placeholder="Nhập tài khoản"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  )
}

export default LoginDrawer
