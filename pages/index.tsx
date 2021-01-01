import { Col, Row } from 'react-grid-system';
import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';

const Title = styled.div`
  font-size: 50px;
  font-weight: 200;
  letter-spacing: 4px;
  color: white;//${({ theme }) => theme.colors.primary};
  margin-top: 30%;
`

const SubTitle = styled.div`
  font-size: 20px;
  margin-bottom: 1rem;
`

const SampleLink = styled.span`
  color: dodgerblue;
  &:hover{
    color: white;
  }
  cursor: pointer;
`

const CustomButton = styled.div`
  width: 200px;
  height: 55px;
  margin-top: 2rem;
  margin-right: 1rem;
  margin-bottom: 4rem;
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

const MainBackground = styled.div`
  position: absolute;
  top: 30%;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-image: url('/images/screenshot.png');
  background-position: top;
  background-size: contain;
  background-repeat: no-repeat;
`

export default function Home() {
  const { t, i18n } = useTranslation()

  return (
    <Row nogutter justify="center">
      <Col md={10} style={{padding: 8, zIndex: 5, minHeight: '90vh'}}>
        <Row nogutter>
          <Col sm={12} md={12} lg={7} >
            <Title>
              GENSHIN PARTY HELPER
            </Title>
            <SubTitle>
              {t("MAIN_TEXT")}
            </SubTitle>
            <Link href="/3bdb4893f246165e">
              <SampleLink>
                See Sample
              </SampleLink>
            </Link>
            <Link href="/create" >
              <CustomButton>
              {t("CREATE_MY_PARTY")}
              </CustomButton>
            </Link>
          </Col>
          <Col sm={12} md={12} lg={5} >
            <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem'}}>
              <img src="/images/screenshot.jpg" style={{width: '100%', alignSelf: 'center'}} />  
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
