import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`

const PrimaryButton = styled.div`
  width: 250px;
  height: 60px;
  background-color: white;
  color: black;
  border: 1px solid gray;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s linear;
  &:hover {
    color: white;
    background-color: dodgerblue;
    border: 1px solid black;
  }
  cursor: pointer;
`

export default function Home() {


  return (
    <>
      <Title>
        Genshin Party Helper
      </Title>
      This website help you make Genshin party and share to others easily. Others can make your party instead!
      <Link href="/create" >
        <PrimaryButton>
         파티 만들기
        </PrimaryButton>
      </Link>
    </>
  )
}
