import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

import Message from '../../components/Message'
import Loader from '../../components/Loader'
import Product from '../../components/Product'
import Notification from '../../components/Notification'

import { listProducts } from '../../actions/productActions'


const HomeScreen = () => {

    // Notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    // Redux To Get Product List
    const dispatch = useDispatch()
    const productList = useSelector((state) => state.productList)
    console.log('Product List : ', productList);
    const { loading, error, products } = productList

    console.log('List Product Error : ', error);
    useEffect(() => {
        dispatch(listProducts())
    }, [dispatch])

    return (
        <>
            <h1>Latest Products</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                        <Row>
                            {products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                    )
            }

            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}

export default HomeScreen
