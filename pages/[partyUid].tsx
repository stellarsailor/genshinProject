import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Col, Row } from 'react-grid-system'
import CharacterPane from '../components/CharacterPane'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styled from 'styled-components'
import { serverUrl } from '../lib/serverUrl'
import { useTranslation } from '../i18n'
import { useAlert } from 'react-alert'
import dynamicSort from '../logics/dynamicSort'
import makeCompString from '../logics/makeCompString'
import makeCompArray from '../logics/makeCompArray'
import CharacterPaneMini from '../components/CharacterPaneMini'
import Scroll from 'react-scroll'

const { Element, scroller } = Scroll

type charPoolType = {
    level: number;
    charId: number;
    weaponId: number | '';
    constellation: number;
}

type recommendedPartyType = {
    id: number;
    fhArray: string;
    shArray: string; 
    likes: number;
    createdAt: string;
}

type selectedType = {
    selected: boolean;
}
const PartyBox = styled("div")<selectedType>`
    width: 95%;
    min-height: 160px;
    background-color: #49556d;
    border: ${props => props.selected ? '2px solid white' : '2px solid rgba(0,0,0,0)' };
    padding: 5px;
    margin: 16px 0px;
    border-radius: 5px;
    z-index: 0;
    transition: .2s linear;
    cursor: pointer;
    &:hover{
        background-color: #546078;
    }
`

type bgColorType = {
    partyNumber: number;
}
const PartyNameColorIndicator = styled("div")<bgColorType>`
    border-left: ${props => props.partyNumber === 0 ? '4px solid #c0ff3f' : '4px solid #00a0e8'};
    padding-left: 8px;
    font-size: 1.2rem;
    font-weight: 600;
    margin-left: 4px;
    margin-bottom: 8px;
`

const CustomButton = styled.div`
    width: 200px;
    height: 55px;
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
    @media (max-width: 768px) {
        width: 150px;
        height: 45px;
        font-size: 14px;
    }
`

const RecommendedPartyBox = styled.div`
    background-color: #373947;
    margin: 16px 0px;
    padding: 6px;
    /* border: 1px solid darkgray; */
    border-radius: 5px;
`

const RecommendedPartyBoxButton = styled.div`
    border-radius: 5px;
    color: #a7b1c1;
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: .2s linear;
    &:hover{
        color: white;
    }
`

export default function PartyDetail(props) {
    const router = useRouter()
    const { t, i18n } = useTranslation()
    const { partyUid } = router.query
    const alert = useAlert()

    const characterList = props.assets.length === 0 ? [] : props.assets.characters
    const weaponList = props.assets.length === 0 ? [] : props.assets.weapons

    const [ charPoolList, setCharPoolList ] = useState<Array<charPoolType>>([])
    const [ savedPartyList, setSavedPartyList ] = useState<Array<recommendedPartyType>>([])

    const [ selectedPartyNumber, setSelectedPartyNumber ] = useState<number>(0)
    const [ party0, setParty0 ] = useState<Array<number>>([])
    const [ party1, setParty1 ] = useState<Array<number>>([])

    const [ disableButton, setDisableButton ] = useState(false)

    async function fetchPool() {
        
        let url = `${serverUrl}/api/pools?uid=${partyUid}`
    
        const res = await fetch(url)
        const data = await res.json()
        
        setCharPoolList(JSON.parse(data.pool.list))
        setSavedPartyList(data.savedPartyList)
    }
    
    useEffect(() => {
        if(router.query.p){
            let compString = router.query.p

            let party0premade = []
            let party1premade = []
            for (var i = 0, charsLength = compString.length; i < charsLength; i += 2) {
                let charId 
                if(typeof compString === 'string'){
                    charId = parseInt(compString.substring(i, i + 2))
                    if(charId !== 99){
                        if(i <= 6) party0premade.push(charId)
                        else party1premade.push(charId)
                    }
                }
            }
            setParty0(party0premade)
            setParty1(party1premade)
        }
        fetchPool()
    },[])

    const createCurrentPartyString = useCallback(() => {
        return serverUrl + `/${i18n.language}/${partyUid}?p=` + makeCompString(party0, false) + makeCompString(party1, false)
    },[ party0, party1 ])

    const addCharToParty = useCallback((charId, partyId) => {
        if(partyId === 0){
            if(party0.includes(charId)){
                setParty0(party0.filter(v => v !== charId))
            } else {
                if(party1.includes(charId)){
                    setParty1(party1.filter(v => v !== charId))
                } else {
                    party0.length === 4 ? null : setParty0([ ...party0, charId ])
                }
            } //add
        } else {
            if(party1.includes(charId)){
                setParty1(party1.filter(v => v !== charId))
            } else {
                if(party0.includes(charId)){
                    setParty0(party0.filter(v => v !== charId))
                } else {
                    party1.length === 4 ? null : setParty1([ ...party1, charId ])
                }
            } //add
        }
    },[ party0, party1 ])

    const instaDeploy = useCallback((charId) => {
        selectedPartyNumber === 1 ? setParty0(party0.filter(v => v !== charId)) : setParty1(party1.filter(v => v !== charId))
    },[selectedPartyNumber])

    const autoGenerateParty = useCallback(() => {
        alert.show(t("PARTY_PARTY_AUTOGENERATE_MSG"))
    },[])

    const saveThisParty = useCallback( async () => {
        setDisableButton(true)
        if(party0.length !== 4 || party1.length !== 4){
            alert.error(t("PARTY_SAVE_ERROR_MSG"))
            return 0
        }
        const fullPartyArray = party0.concat(party1)

        let url = `${serverUrl}/api/pools`

        const settings = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: partyUid,
                compString: makeCompString(fullPartyArray, true),
                compArray: makeCompArray(fullPartyArray),
                fhString: makeCompString(party0, true),
                fhArray: makeCompArray(party0),
                shString: makeCompString(party1, true),
                shArray: makeCompArray(party1),
            })
        }
        try {
            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            if(data.result.affectedRows === 1){
                fetchPool()
                setDisableButton(false)
                alert.success('Party is saved!')
            } else {
                alert.error("Something's wrong... Try few minutes later")
            }
        } catch (e) {
            return e;
        }
    },[ party0, party1 ])

    const applyFromRecommendedParty = ( fhArray, shArray ) => {

        setParty0(fhArray.split(',').map(Number))
        setParty1(shArray.split(',').map(Number))

        scroller.scrollTo( "PARTIES", {
            duration: 800,
            delay: 100,
            smooth: true,
            offset: -50, 
        })
    }

    return(
        <Row nogutter justify="center">
            <div style={{width: '100%', textAlign: 'right', marginTop: '1rem', fontSize: '1.2rem'}}>
                <CopyToClipboard text={createCurrentPartyString()} 
                onCopy={() => alert.success('Link is copied!')}>
                    <span style={{width: '100%', margin: '0px 1rem', cursor: 'pointer'}}>
                        <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Sgare-White-Icon-PNG.png" width={15} style={{marginRight: 8}} />{t("PARTY_SHARE")}
                    </span>
                </CopyToClipboard>
            </div>
            {
                (charPoolList.length === 0 || characterList.length === 0 || weaponList.length === 0) 
                ?
                <div>Loading...</div>
                :
                <>
                    <Col xs={12} sm={12} md={12} lg={7} style={{padding: '1rem', paddingBottom: 0}}>
                        <Row nogutter>
                            { charPoolList.sort(dynamicSort("-level")).map(char => (
                                <Col xs={3} sm={3} md={3} lg={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={char.charId}>
                                    <CharacterPane 
                                    char={char}
                                    charInfo={characterList[char.charId]}
                                    weaponInfo={char.weaponId !== '' && weaponList[char.weaponId]}
                                    party0={party0}
                                    party1={party1}
                                    onClick={() => addCharToParty(char.charId, selectedPartyNumber)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={5} >
                        <div>
                            <Element name="PARTIES" />
                            <PartyBox selected={selectedPartyNumber === 0 ? true : false } onClick={() => setSelectedPartyNumber(0)}>
                                <PartyNameColorIndicator partyNumber={0}>{t("PARTY_FIRST_HALF")}</PartyNameColorIndicator>
                                <Row nogutter>
                                    {party0.length !== 0 && party0.map((charId, index) => (
                                        <Col xs={3} sm={3} md={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={charId}>
                                            <CharacterPane 
                                            char={charPoolList.filter(v => v.charId === charId)[0]}
                                            charInfo={characterList[charId]}
                                            weaponInfo={charPoolList.filter(v => v.charId === charId)[0].weaponId !== '' 
                                                && weaponList[charPoolList.filter(v => v.charId === charId)[0].weaponId]}
                                            party0={party0}
                                            party1={party1}
                                            inParty={true}
                                            onClick={() => selectedPartyNumber === 0 ? addCharToParty(charId, selectedPartyNumber) : instaDeploy(charId)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </PartyBox>
                            <PartyBox selected={selectedPartyNumber === 1 ? true : false} onClick={() => setSelectedPartyNumber(1)}>
                                <PartyNameColorIndicator partyNumber={1}>{t("PARTY_SECOND_HALF")}</PartyNameColorIndicator>
                                <Row nogutter>
                                    {party1.length !== 0 && party1.map((charId, index) => (
                                        <Col xs={3} sm={3} md={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={charId}>
                                            <CharacterPane 
                                            char={charPoolList.filter(v => v.charId === charId)[0]}
                                            charInfo={characterList[charId]}
                                            weaponInfo={charPoolList.filter(v => v.charId === charId)[0].weaponId !== '' 
                                                && weaponList[charPoolList.filter(v => v.charId === charId)[0].weaponId]}
                                            party0={party0}
                                            party1={party1}
                                            inParty={true}
                                            onClick={() => selectedPartyNumber === 1 ? addCharToParty(charId, selectedPartyNumber) : instaDeploy(charId)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </PartyBox>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                <CustomButton onClick={() => autoGenerateParty()}>
                                    {t("PARTY_AUTOGENERATE")}
                                </CustomButton>
                                <CustomButton onClick={() => disableButton ? console.log('fetching...') : saveThisParty()}>
                                    {t("PARTY_SAVE")}
                                </CustomButton>
                            </div>
                            <div>
                                <div style={{fontSize: '1.2rem', margin: 8, marginTop: 16}}>
                                    {t("PARTY_SAVED_LIST")}
                                </div>
                                {
                                    savedPartyList.length === 0 &&
                                    <div>
                                        NO DATA
                                    </div>
                                }
                                {savedPartyList.map((v, index) => (
                                    <RecommendedPartyBox key={index}>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            <Row nogutter style={{width: '100%'}}>
                                                <Col xs={6} sm={6} md={4} style={{display: 'flex', flexDirection: 'row'}}>
                                                    {v.fhArray.split(',').map(Number).map(charId => 
                                                        <CharacterPaneMini charName={characterList[charId].name_en} key={charId} />
                                                    )}
                                                </Col>
                                                <Col xs={6} sm={6} md={4} style={{display: 'flex', flexDirection: 'row'}}>
                                                    {v.shArray.split(',').map(Number).map(charId => 
                                                        <CharacterPaneMini charName={characterList[charId].name_en} key={charId} />
                                                    )}
                                                </Col>
                                                <Col xs={6} sm={6} md={4} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                                                    <img src="https://genshin.honeyhunterworld.com/img/skills/fantastic_voyage.png" width={20} height={20} />
                                                    {v.likes}
                                                    <RecommendedPartyBoxButton onClick={() => applyFromRecommendedParty(v.fhArray, v.shArray)}>
                                                        Apply
                                                    </RecommendedPartyBoxButton>
                                                    <CopyToClipboard text={serverUrl + `/${i18n.language}/${partyUid}?p=${v.fhArray.replaceAll(',', '') + v.shArray.replaceAll(',', '')}`} onCopy={() => alert.success('Link is copied!')}>
                                                        <RecommendedPartyBoxButton>
                                                            Share
                                                        </RecommendedPartyBoxButton>
                                                    </CopyToClipboard>
                                                </Col>
                                            </Row>
                                        </div>
                                    </RecommendedPartyBox>
                                ))}
                            </div>
                        </div>
                    </Col>
                </>
            }
        </Row>
    )
}

// export async function getServerSideProps({ params, req }) {

    // let url = `${serverUrl}/api/bingos/${params.bingoId}`

    // const res = await fetch(url)
    // const data = await res.json()

    // return { props: { data } }
// }