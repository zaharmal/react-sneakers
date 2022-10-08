import React from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import Drawer from './components/Drawer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';

export const AppContext = React.createContext({});

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const cartResponse = await axios.get('https://633d09f2f2b0e623dc6bb622.mockapi.io/cart');
        const favoritesResponse = await axios.get('https://633d09f2f2b0e623dc6bb622.mockapi.io/favorites');
        const itemsResponse = await axios.get('https://633d09f2f2b0e623dc6bb622.mockapi.io/items');
        setCartItems(cartResponse.data);
        setFavorites(favoritesResponse.data);
        setItems(itemsResponse.data);
      } catch (error) {
        alert('ошибка при запросе данных');
      }
    }
    fetchData();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const finedItem = cartItems.find((item) => Number(item.parentId) == Number(obj.id));
      if (finedItem) {
        setCartItems((prev) => prev.filter(item => Number(obj.parentId) != Number(obj.id)));
        await axios.delete(`https://633d09f2f2b0e623dc6bb622.mockapi.io/cart/${finedItem.id}`);
      } else {
        setCartItems((prev) => [...prev, obj]);
        const {data} = await axios.post('https://633d09f2f2b0e623dc6bb622.mockapi.io/cart', obj);
        setCartItems((prev) => prev.map(item => {
          if (item.parentId == data.parentId) {
            return {
              ...item,
              id: data.id
            };
          }
          return item;
        }));
      }
    } catch (error) {
      alert('ошибка при добавлении в корзину');
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://633d09f2f2b0e623dc6bb622.mockapi.io/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => Number(item.id) != Number(id)));
    } catch (error) {
      alert('ошибка при удалении из корзины');
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      if (favorites.find((favObj) => Number(favObj.id) == Number(obj.id))) {
        axios.delete(`https://633d09f2f2b0e623dc6bb622.mockapi.io/favorites/${obj.id}`);
        setFavorites((prev) => prev.filter(item => Number(obj.id) != Number(obj.id)));
      } else {
        const { data } = await axios.post('https://633d09f2f2b0e623dc6bb622.mockapi.io/favorites', obj);
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert('Не удалось добавить в фавориты')
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) == Number(id))
  }

  return (
    <AppContext.Provider value={{ items, cartItems, favorites, isItemAdded, onAddToFavorite, onAddToCart, setCartOpened, setCartItems }}>
      <div className="wrapper clear">
        <Drawer items={cartItems} onClose={() => setCartOpened(false)} onRemove={onRemoveItem} opened={cartOpened} />
        <Header onClickCart={() => setCartOpened(true)} />

        <Route path='/' exact>
          <Home
            items={items}
            cartItems={cartItems}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading}
          />
        </Route>

        <Route path='/favorites' exact>
          <Favorites />
        </Route>

        <Route path='/orders' exact>
          <Orders />
        </Route>

      </div>
    </AppContext.Provider>
  );
}

export default App;
