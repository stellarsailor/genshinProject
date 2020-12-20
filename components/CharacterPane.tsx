import styled from 'styled-components'

const MainContainer = styled.div`
    width: 120px;
    height: 150px;
    margin-bottom: 20px;
    position: relative;
    cursor: pointer;
`

const TopLeftBox = styled.div`
    top: 2px;
    left: 2px;
    position: absolute;
    z-index: 10;
`

const BottomLeftBox = styled.div`
    bottom: 30px;
    position: absolute;
    z-index: 10;
    margin: 5px;
    font-size: 20px;
    font-weight: bold;
`

const BottomRightBox = styled.div`
    background-color: rgba(0, 0, 0, 0.7);
    bottom: 30px;
    right: 0px;
    position: absolute;
    z-index: 10;
    margin: 5px;
    font-size: 20px;
    font-weight: bold;
`

const CharacterBox = styled.div`
    width: 100%;
    height: 100%;
    background-color: orange;
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
    font-size: 20px;
    font-weight: bold;
`

const ClickedTopBar = styled.div`
    position: absolute;
    top: 0;
    width: 100%;
    height: 10px;
    margin-top: -6px;
    background-color: #c0ff3f;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    z-index: -10;
`

const ClickedBottomBar = styled.div`
    width: 100%;
    height: 10px;
    margin-top: -5px;
    background-color: #c0ff3f;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 0;
`

const InPartyNumber = styled.div`
    top: 0;
    right: 0;
    position: absolute;
    color: #32332e;
    background-color: #c0ff3f;
    width: 30px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 5px;
    font-size: 20px;
    font-weight: bold;
`

export default function CharacterPane( props: any ){

    const { 
        character, 
        charLevel, 
        constellation, 
        isOwned,
        isClicked 
    } = props

    return (
        <MainContainer>
            <TopLeftBox>
                <img src={`/images/elements/${character.element}.png`} width="30" height="30" />
            </TopLeftBox>
            <BottomLeftBox>
                
            </BottomLeftBox>
            <BottomRightBox>
                <img src="/images/weapons/favonius_warbow.jpeg" width="30" height="30" />
            </BottomRightBox>
            <CharacterBox>
                <img src={`/images/characters/${character.name_en}.png`} width="100%" height="100%" />
            </CharacterBox>
            <BottomBox>
                <BottomText>
                C{constellation} / Lv.{charLevel}
                </BottomText>
            </BottomBox>
            {
                isClicked && 
                <>
                    <InPartyNumber>
                        1
                    </InPartyNumber>
                    <ClickedTopBar />
                    <ClickedBottomBar />
                </>
            }
        </MainContainer>
    )
}