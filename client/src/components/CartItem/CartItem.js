import { CartItemContainer } from './CartItem.styled';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelected, setAllSelected, setCartItems } from '../../redux/actions/cartActions';
import axios from 'axios';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const selected = useSelector((state) => state.cart.selected);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [curQuantity, setCurQuantity] = useState();

  useEffect(() => {
    setCurQuantity(item.quantity);
  }, []);

  const handleCheckClick = (checkedItem) => {
    const updatedSelected = (selected.map(item => item.product.id).includes(checkedItem.product.id)) ? selected.filter(item => item.product.id !== checkedItem.product.id) : [...selected, checkedItem];
    dispatch(setSelected(updatedSelected));
    dispatch(setAllSelected(updatedSelected.length === cartItems.length));
  }

  const handleQuantityChange = (productId, newQuantity) => {
    setCurQuantity(newQuantity);

    axios.patch(`${apiUrl}/cart/update/${productId}?quantity=${newQuantity}`)
      .then((response) => {
        dispatch(setCartItems(response.data));
      })
      .catch((error) => {
        console.error(`Failed to update item's quantity: `, error);
      })
      .finally(() => {
        console.log(productId, newQuantity);
      })
  }

  return (
    <CartItemContainer>
      <td>
        <button className='checkbox-container' onClick={() => handleCheckClick(item)}>
          <input
            type='checkbox'
            checked={selected.map(item => item.product.id).includes(item.product.id)} />
        </button>
      </td>
      <td className='name'>
        <Link to={`/products/${item.product.id}`}>
          <img src={item.product.img} alt='' />
          {item.product.productName}
        </Link>
      </td>
      <td className='price'>
        {item.product.productPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className='quantity'>
        <input
          type='number'
          min='1'
          max='99'
          value={curQuantity}
          onChange={(event) => handleQuantityChange(item.product.id, event.target.value)}
        />
      </td>
      <td className='total-price'>
        {(item.product.productPrice * curQuantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        {/* {(item.totalPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
      </td>
    </CartItemContainer>
  )
}