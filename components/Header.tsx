import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const HeaderPane = styled.div`
    width: 100%;
    height: 50px;
    background-color: #222430;
    border-bottom: 1px solid #323430;
`

export default function Header() {

    return (
        <HeaderPane>
            <Link href="/">
                Home
            </Link>
        </HeaderPane>
    )
}