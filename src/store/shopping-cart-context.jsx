import {createContext, useReducer} from "react";
import {DUMMY_PRODUCTS} from "../dummy-products.js";

export const ShoppingCartContext = createContext({
    items: [],
    addItemToCart: () => {
    },
    updateItemQuantity: () => {
    }
})

const shoppingCartReducer = (state, action) => {
    if (action.type === 'ADD_ITEM') {
        const updatedItems = [...state.items];

        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            updatedItems[existingCartItemIndex] = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
        } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            updatedItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            items: updatedItems,
        };
    }
    if (action.type === 'UPDATE_ITEM') {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.productId
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
        };
    }


    return state;
}

const ShoppingCartContextProvider = ({children}) => {
    const [shoppingCartState, shoppingCartDispatch] = useReducer(
        shoppingCartReducer,
        {
            items: [],
        })

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
                type: 'ADD_ITEM',
                payload: id
            }
        )
    }

    function handleUpdateCartItemQuantity(productId, amount) {
       shoppingCartDispatch({
           type: 'UPDATE_ITEM',
           payload: {
               productId,
               amount
           }
       })
    }

    const cxtValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
    }
    return <ShoppingCartContext/*.Provider*/ value={cxtValue}>{children}</ShoppingCartContext>

}

export default ShoppingCartContextProvider