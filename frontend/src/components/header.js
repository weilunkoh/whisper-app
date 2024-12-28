import { useLocation } from 'react-router';
import { navigation } from "../props/navigation";

const Header = () => {
  const currentRoute = useLocation()["pathname"];
  const navigationItem = navigation.filter((item) => item.href.includes(currentRoute))[0];
  const title = navigationItem.name;
  const description = navigationItem.description;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl tracking-tight font-bold text-gray-900">{title}</h1>
        <p>{description}</p>
      </div>
    </header>
  )
}

export default Header;