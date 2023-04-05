import { useContext } from 'react';
import { Context as AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { state } = useContext(AuthContext);
  return <div>Home Page</div>;
};

export default Home;
