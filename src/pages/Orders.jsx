import React from 'react';
import Card from '../components/Card';
import { AppContext } from '../App';
import axios from 'axios';

function Orders() {
  const {onAddToFavorite, onAddToCart} = React.useContext(AppContext);
  const [orders, setOrders] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    (async() => {
      try {
        const { data } = await axios.get('https://633d09f2f2b0e623dc6bb622.mockapi.io/orders');
        setOrders(data.reduce((prev, obj) => [...prev, ...obj.items], []));
        setIsLoading(false);
      } catch (error) {
        alert('ошибка при запросе заказов');
        console.error(error);
      }
    })();
  }, []);

  return(
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мои заказы</h1>
      </div>
      <div className="d-flex flex-wrap">
        {orders.map((item, index) => (
          <Card key={index}
          loading={isLoading}
          {...item}
          />
        ))}
      </div>
    </div>
  )
}

export default Orders;