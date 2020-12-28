import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const HeaderPane = styled.div`
    width: 100%;
    height: 50px;
    background-color: black;
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