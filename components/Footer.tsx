import { Col, Row } from 'react-grid-system'
import styled from 'styled-components'

const FooterPane = styled.div`
    width: 100%;
    height: 50px;
    background-color: #121421;
`

export default function Footer() {

    return (
        <FooterPane>
            <Row nogutter justify="center">
                <Col md={10}>
                    a   sdasd
                </Col>
            </Row>
        </FooterPane>
    )
}