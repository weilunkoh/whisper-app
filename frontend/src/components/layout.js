import Topbar from '../components/topbar'

const Layout = ({ children }) => {
  return (
    <div className="h-full bg-gray-100">
      <Topbar />
      <div className="min-h-full">
        {children}
      </div>
    </div>
  )
}

export default Layout;