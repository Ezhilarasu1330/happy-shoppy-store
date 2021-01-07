import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

import Meta from '../../components/Meta'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import Product from '../../components/Product'
import Paginate from '../../components/Paginate'
import Notification from '../../components/Notification'
import ProductCarousel from '../../components/ProductCarousel'

import { listProducts } from '../../actions/productActions'


const HomeScreen = ({ match }) => {

    // Notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    // Redux To Get Product List
    const keyword = match.params.keyword
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()
    const productList = useSelector((state) => state.productList)
    const { loading, error, products, page, pages } = productList

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])


    return (
        <>
            <Meta />
            {!keyword ?
                (<ProductCarousel />) : (
                    <Link to='/' className='btn btn-light'>Go Back</Link>
                )}
            <h1>Latest Products</h1>
            {loading ?
                (<Loader />)
                : error ?
                    (<Message variant='danger'>{error}</Message>)
                    :
                    (<>
                        <Row>
                            {products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate
                            pages={pages}
                            page={page}
                            keyword={keyword ? keyword : ''}
                        />
                    </>)
            }

            <Notification
                notify={notify}
                setNotify={setNotify}
            />
        </>
    )
}

export default HomeScreen
