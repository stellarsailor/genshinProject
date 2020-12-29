import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`

export default function Home() {


  return (
    <>
      <Title>
        Genshin Party Helper
      </Title>
      <Link href="/create" >
        파티 만들기
      </Link>
    </>
  )
}
