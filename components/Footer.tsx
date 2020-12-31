import { Col, Row } from 'react-grid-system'
import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const FooterPane = styled.div`
    width: 100%;
    min-height: 50px;
    background-color: #121421;
`

const CombinedButton = styled.div`
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50px;
    cursor: pointer;
`

export default function Footer() {

    return (
        <FooterPane>
            <Row nogutter justify="center">
                <Col md={10}>
                    <Link href="/about">
                        <CombinedButton>
                            Contact | Disclaimer | Privacy Policy
                        </CombinedButton>
                    </Link>
                    <div style={{fontSize: 12, textAlign: "center", marginBottom: '2rem'}}>
                        GenshinParty isn’t endorsed by MiHoYo and doesn’t reflect the views or opinions of MiHoYo or anyone officially involved in producing or managing Genshin Impact. Genshin Impact and MiHoYo are trademarks or registered trademarks of MiHoYo, Inc. Genshin Impact © MiHoYo, Inc.
                    </div>
                </Col>
            </Row>
        </FooterPane>
    )
}