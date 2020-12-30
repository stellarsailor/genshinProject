import { Col, Row } from 'react-grid-system';
import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const HeaderPane = styled.div`
    width: 100%;
    height: 50px;
    background-color: #222430;
    border-bottom: 1px solid #323430;
`

const HeaderHomeButton = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 16px;
    cursor: pointer;
`

export default function Header() {

    return (
        <HeaderPane>
            <Row nogutter justify="center">
                <Col md={10}>
                    <Link href="/">
                        <HeaderHomeButton>
                            <img src="/images/logo.png" height={40} /> 
                        </HeaderHomeButton>
                    </Link>
                </Col>
            </Row>
        </HeaderPane>
    )
}