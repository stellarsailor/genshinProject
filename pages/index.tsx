import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`

const CustomButton = styled.div`
  width: 200px;
  height: 55px;
  margin-right: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: #ebe5d7;
  border: 1px solid #42495b;
  color: #42495b;
  font-size: 18px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: .2s linear;
  &:hover{
      background-color: white;       
  }
`

export default function Home() {
  const { t, i18n } = useTranslation()

  return (
    <>
      <Title>
        Genshin Party Helper
      </Title>
      This website help you make Genshin party and share to others easily. Others can make your party instead!
      <Link href="/create" >
        <CustomButton>
         {t("CREATE_MY_PARTY")}
        </CustomButton>
      </Link>
    </>
  )
}
