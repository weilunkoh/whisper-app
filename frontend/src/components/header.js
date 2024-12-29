import { useLocation } from 'react-router';
import { navigation } from "../props/navigation";
import HeaderDisplay from './headerDisplay';

const Header = () => {
  const currentRoute = useLocation()["pathname"];
  const navigationItem = navigation.filter((item) => item.href.includes(currentRoute))[0];
  const title = navigationItem.name;
  const description = navigationItem.description;

  return (
    <HeaderDisplay title={title} description={description} />
  )
}

export default Header;