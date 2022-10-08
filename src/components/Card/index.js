import React from 'react';
import ContentLoader from "react-content-loader"
import styles from './Card.module.scss';
import { AppContext } from '../../App';

function Card({ id, onFavorite, title, imageUrl, price, onPlus, favorited = false, loading = false }) {

  const { isItemAdded } = React.useContext(AppContext);
  const [isFavorite, setIsFavorite] = React.useState(favorited);
  const obj = { id, parentId: id, title, imageUrl, price };

  const OnClickPlus = () => {
    onPlus(obj);
  };

  const onClickFavorite = () => {
    onFavorite(obj);
    setIsFavorite(!isFavorite);
  };

  return(
    <div className={styles.card}>
      {
        loading ? 
        <ContentLoader
          speed={2}
          width={150}
          height={265}
          viewBox="0 0 150 265"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="0" rx="10" ry="10" width="150" height="90" />
          <rect x="0" y="101" rx="5" ry="5" width="150" height="15" />
          <rect x="0" y="131" rx="5" ry="5" width="100" height="15" />
          <rect x="0" y="159" rx="5" ry="5" width="80" height="25" />
          <rect x="110" y="147" rx="10" ry="10" width="32" height="32" />
        </ContentLoader> : 
        <>
          {onFavorite && (
            <div className={styles.favorite} onClick={onClickFavorite}>
              <img src={isFavorite ? 'img/liked.svg' : 'img/unliked.svg'} alt="unliked" />
            </div>
          )}
          <img width={133} height={112} src={imageUrl} alt="sneakers" />
          <h5>{title}</h5>
          <div className="d-flex justify-between align-center">
            <div className="d-flex flex-column">
              <span>Цена:</span>
              <b>{price} руб.</b>
            </div>
              {onPlus && <img className={styles.plus} onClick={OnClickPlus} src={isItemAdded(id) ? 'img/btn-checked.svg' : 'img/btn-plus.svg'} alt="plus" />}
          </div>
        </>
      }
      
    </div>
  );
}

export default Card;