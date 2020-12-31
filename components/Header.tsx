import { useState } from 'react';
import { Col, Row } from 'react-grid-system';
import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n'
import langCodeToLanguage from '../logics/langCodeToLanguage'

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

const LangButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px; 
    cursor: pointer;
`

const LangPane = styled.div`
    position: fixed;
    top: 70px;
    right: 20px;
    width: 150px;
    height: 100px;
    background-color: #1d1f29;
    z-index: 50;
    box-shadow: 0px 0px 35px -3px black;
`

const LangInlineTab = styled.div`
    margin: 4px 8px;
    border-bottom: 1px solid #323430;
    cursor: pointer;
    &:hover {
        background-color: #121420;
    }
`

export default function Header() {
    const { t, i18n } = useTranslation()
    const [ supportedLanguages, setSupportedLanguages ] = useState(i18n.options.supportedLngs || [])

    const [ langModal, setLangModal ] = useState(false)

    return (
        <HeaderPane>
            <Row nogutter justify="center">
                <Col md={10} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Link href="/">
                        <HeaderHomeButton>
                            <img src="/images/logo.png" height={40} /> 
                        </HeaderHomeButton>
                    </Link>
                    <LangButton onClick={() => setLangModal(!langModal)}>
                        <img src="/images/i18n.png" style={{width: 20, height: 20}} />
                    </LangButton>
                </Col>
            </Row>
            {
                langModal && 
                <LangPane>
                    {supportedLanguages.map((v, index) => {
                        if(index !== supportedLanguages.length - 1)
                        return (
                            <LangInlineTab key={index} onClick={() => {i18n.changeLanguage(v); setLangModal(false)}} style={{padding: '8px 20px'}}>
                                {langCodeToLanguage(v)}
                            </LangInlineTab>
                        )
                    })}
                </LangPane>
            }
        </HeaderPane>
    )
}