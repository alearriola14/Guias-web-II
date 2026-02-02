import { useState, useEffect } from 'react'
import { Header } from './componentes/Header'
import { Footer } from './componentes/Footer'
import { Guitar } from './componentes/Guitar'
import { db } from './data/db'

function App() {
    function initialCart(){
        const localStorageCart=localStorage.getItem('cart')
        return localStorageCart ? JSON.parse (localStorageCart) : []
    }

    const [data, setData] = useState(db);
    const [cart, setCart] = useState(initialCart);
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart])


     function addToCart(guitar) {

        const itemIndex= cart.findIndex((item) => guitar.id === item.id)
        console.log(itemIndex);
        if (itemIndex=== -1) { //la guitarra no existe, por lo tanto se anade al carrito
            guitar.quantity=1;
            
        setCart([...cart, guitar])
        }
        else{ //si la guitarra ya existe en el carrito, solo se actualiza la cantidad
            // crear una copia de la variable
            const updatedCart=[...cart];
            updatedCart[itemIndex].quantity ++;
            setCart (updatedCart);

        }
        
    }

    function calculateTotal() {
        let total= cart.reduce((total, item)=> total +item.price * item.quantity,0)
        return total;
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if(item.id === id) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map(item => {
            if(item.id === id && item.quantity > 1) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function clearCart() {
        setCart([])
    }

    return (
        <>
            <Header 
                cart={cart} 
                total={calculateTotal()} 
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
            />
            <main className="container-xl mt-5">
                <h2 className="text-center">Nuestra Colección</h2>

                <div className="row mt-5">
                    {data.map((guitar)=> (
                        <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart}  />
                    )
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default App
