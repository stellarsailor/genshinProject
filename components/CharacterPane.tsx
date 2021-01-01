import styled from 'styled-components'
import { useTranslation, Router, Link } from '../i18n';
import FirstLetterToLower from '../logics/FirstLetterToLower'

const MainContainer = styled.div`
    width: 120px;
    height: 150px;
    margin-bottom: 20px;
    position: relative;
    border: 2px solid rgba(0, 0, 0, 0);
    cursor: pointer;
    @media (max-width: 1200px) {
        width: 100px;
        height: 130px;
    }
    @media (max-width: 768px) {
        width: 80px;
        height: 120px;
    }
    transition: transform .3s;
    &:hover {
        /* width: 130px;
        height: 160px; */
        border: 2px solid white;
        border-radius: 5px;
        transform: scale(1.03);
    }
`

const TopLeftBox = styled.div`
    width: 30px;
    height: 30px;
    top: 2px;
    left: 2px;
    position: absolute;
    z-index: 10;
    @media (max-width: 768px) {
        width: 20px;
        height: 20px;
    }
`

const BottomLeftBox = styled.div`
    bottom: 30px;
    position: absolute;
    z-index: 10;
    margin: 5px;
    font-size: 20px;
    font-weight: bold;
`

const BottomWeaponNameBox = styled.div`
    background-color: rgba(0, 0, 0, 0.7);
    height: 20px;
    overflow: hidden;
    bottom: 30px;
    left: 0px;
    position: absolute;
    z-index: 10;
    margin: 0px;
    padding-right: 2px;
    font-size: 11px;
    line-height: 90%;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (max-width: 768px) {
        font-size: 8px;
    }
`
type starType = {
    stars: number;
}
const CharacterBox = styled("div")<starType>`
    width: 100%;
    height: 100%;
    background-color: ${props => props.stars === 5 ? '#9c6d35' : '#6d629a'};
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
`

const BottomBox = styled.div`
    width: 100%;
    height: 30px;
    position: absolute;
    bottom: 0;
    background-color: #e9e5dc;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
`

const BottomText = styled.span`
    width: 100%;
    text-align: center;
    color: #4f576a;
    font-size: 17px;
    font-weight: bold;
    @media (max-width: 768px) {
        font-size: 15px;
    }
    @media (max-width: 400px) {
        font-size: 14px;
    }
`

type bgColorType = {
    partyNumber: number;
}
const ClickedTopBar = styled("div")<bgColorType>`
    position: absolute;
    top: 0;
    width: 100%;
    height: 5px;
    margin-top: -2px;
    background-color: ${props => props.partyNumber === 1 ? '#c0ff3f' : '#00a0e8'};
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    z-index: 1;
`

const ClickedBottomBar = styled("div")<bgColorType>`
    width: 100%;
    height: 10px;
    margin-top: -5px;
    background-color: ${props => props.partyNumber === 1 ? '#c0ff3f' : '#00a0e8'};
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 1;
`

const InPartyNumber = styled("div")<bgColorType>`
    top: 0;
    right: 0;
    position: absolute;
    color: #32332e;
    background-color: ${props => props.partyNumber === 1 ? '#c0ff3f' : '#00a0e8'};
    width: 30px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 20px;
    font-weight: bold;
    z-index: 20;
    @media (max-width: 768px) {
        width: 20px;
        height: 20px;
        font-size: 16px;
    }
`

export default function CharacterPane( props: any ){
    const { t, i18n } = useTranslation()

    const { 
        char,
        charInfo,
        weaponInfo,
        party0,
        party1,
        inParty,
        onClick
    } = props

    const weaponbgColor = (stars) => {
        if(stars === 5) return '#d29d51'
        else if(stars === 4) return '#ad81c1'
        else if(stars === 3) return '#4b94aa'
        else return '#697481'
    } 

    return (
        <MainContainer onClick={onClick}>
            <TopLeftBox>
                <img src={`/images/elements/${FirstLetterToLower(charInfo.element)}.png`} width="100%" height="100%" />
            </TopLeftBox>
            { weaponInfo && 
                <BottomWeaponNameBox>
                {weaponInfo['type'] === 'none' ?
                    <img src={`/images/weapons/${charInfo.weapon}.png`} width="20px" height="20px" style={{backgroundColor: weaponbgColor(weaponInfo.stars)}} />
                    :
                    <img src={`/images/weapons/${weaponInfo['type']}/${weaponInfo[`name_en`].replaceAll(' ', '_')}.png`} width="20px" height="20px" style={{backgroundColor: weaponbgColor(weaponInfo.stars)}} />
                }
                {weaponInfo[`name_${i18n.language}`]}  
                </BottomWeaponNameBox>
            }
            <CharacterBox stars={charInfo.stars}>
                <img src={`/images/characters/${FirstLetterToLower(charInfo.name_en)}.png`} width="100%" style={{marginBottom: 20}} />
            </CharacterBox>
            <BottomBox>
                <BottomText>
                Lv.{char.level} / {i18n.language === 'en' && 'C'}{char.constellation}{i18n.language === 'ko' && '돌'}
                </BottomText>
            </BottomBox>
            {
                !inParty && (party0.includes(char.charId) || party1.includes(char.charId)) &&
                <>
                    <InPartyNumber partyNumber={party0.includes(char.charId) ? 1 : 2}>
                        {party0.includes(char.charId) ? party0.findIndex(v => v === char.charId) + 1 : party1.findIndex(v => v === char.charId) + 1}
                    </InPartyNumber>
                    <ClickedTopBar partyNumber={party0.includes(char.charId) ? 1 : 2} />
                    <ClickedBottomBar partyNumber={party0.includes(char.charId) ? 1 : 2} />
                </>
            }
        </MainContainer>
    )
}