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
import hasDuplicates from '../logics/hasDuplicates'
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

const ChangePartyModeButton = styled.div`
    font-size: 14px;
    margin-top: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: lightgray;
    &:hober{
        color: white;
    }
`

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

    const [ poolId, setPoolId ] = useState(0)
    const [ title, setTitle ] = useState('')
    const [ charPoolList, setCharPoolList ] = useState<Array<charPoolType>>([])
    const [ savedPartyList, setSavedPartyList ] = useState<Array<recommendedPartyType>>([])

    const [ partyMode, setPartyMode ] = useState(2)
    const [ selectedPartyNumber, setSelectedPartyNumber ] = useState<number>(0)
    const [ party0, setParty0 ] = useState<Array<number>>([])
    const [ party1, setParty1 ] = useState<Array<number>>([])

    const [ disableButton, setDisableButton ] = useState(false)

    async function fetchPool() {
        let url = `${serverUrl}/api/pools?uid=${partyUid}`
    
        const res = await fetch(url)
        const data = await res.json()
        
        setPoolId(data.pool.id)
        setTitle(data.pool.title)
        setCharPoolList(JSON.parse(data.pool.list))
        setSavedPartyList(data.savedPartyList)
    }
    
    useEffect(() => {
        scrollTo(0,0)
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
            if(compString.length > 8) {
                setPartyMode(2)
                setParty0(party0premade)
                setParty1(party1premade)
            } else {
                setPartyMode(1)
                setParty0(party0premade)
            }
        }
        fetchPool()
    },[])

    const togglePartyMode = useCallback(() => {
        if(partyMode === 1){
            setPartyMode(2)
            setParty1([])
        } else {
            setPartyMode(1)
            setParty1([])
        }
    },[partyMode])

    const createCurrentPartyString = useCallback(() => {
        if(party0.length === 0 && party1.length === 0){
            return serverUrl + `/${i18n.language}/${partyUid}`
        } else if (partyMode === 1){
            return serverUrl + `/${i18n.language}/${partyUid}?p=` + makeCompString(party0, false)
        } else {
            return serverUrl + `/${i18n.language}/${partyUid}?p=` + makeCompString(party0, false) + makeCompString(party1, false)
        }
    },[ party0, party1, partyMode ])

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
        if(party0.length !== 4 || ( partyMode === 2 && party1.length !== 4)){
            alert.error(t("PARTY_SAVE_ERROR_MSG"))
            return 0
        }
        if(hasDuplicates(party0) || hasDuplicates(party1)){
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
                pool_id: poolId,
                compString: makeCompString(fullPartyArray, true),
                compArray: makeCompArray(fullPartyArray),
                fhString: makeCompString(party0, true),
                fhArray: makeCompArray(party0),
                shString: partyMode === 2 ? makeCompString(party1, true) : "",
                shArray: partyMode === 2 ? makeCompArray(party1) : "",
            })
        }
        try {
            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            if(data.result.affectedRows === 1){
                fetchPool()
                alert.success(t("PARTY_SAVE_SUCCESS"))
                setDisableButton(false)

                scroller.scrollTo( "ENDOFLIST", {
                    duration: 800,
                    delay: 100,
                    smooth: true,
                    offset: -50, 
                })
            } else {
                alert.error(t("TRY_AGAIN_LATER"))
                setDisableButton(false)
            }
        } catch (e) {
            return e;
        }
    },[ party0, party1, partyMode ])

    const applyFromRecommendedParty = useCallback((fhArray, shArray) => {
        if(shArray === '') {
            setPartyMode(1)
            setParty0(fhArray.split(',').map(Number))
            setParty1([])
        } else {
            setPartyMode(2)
            setParty0(fhArray.split(',').map(Number))
            setParty1(shArray.split(',').map(Number))
        }

        scroller.scrollTo( "PARTIES", {
            duration: 800,
            delay: 100,
            smooth: true,
            offset: -50, 
        })
    },[ partyMode ])
    

    return(
        <Row nogutter justify="center">
            <Row style={{width: '100%', marginTop: '1rem', display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}>
                <Col sm={12} md={9} style={{fontSize: '1.4rem'}}>
                    {title}
                </Col>
                <Col sm={12} md={3} >
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <CopyToClipboard 
                        text={serverUrl + `/${i18n.language}/${partyUid}`} 
                        onCopy={() => alert.success(t("LINK_COPY_SUCCESS"))}
                        >
                            <div style={{display: 'flex', flexDirection: 'row', marginTop: 8, marginRight: 16, cursor: 'pointer'}}>
                                <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Sgare-White-Icon-PNG.png" style={{width: 16, height: 16, marginRight: 8}} />
                                {t("PARTY_SHARE_PAGE")}
                            </div>
                        </CopyToClipboard>
                    </div>
                </Col>
            </Row>
            {
                (charPoolList.length === 0 || characterList.length === 0 || weaponList.length === 0) 
                ?
                <div style={{display: 'flex', justifyContent: "center", alignItems: 'center', minHeight: '100vh'}}>Loading...</div>
                :
                <>
                    <Col xs={12} sm={12} md={12} lg={7} style={{padding: '1rem', paddingBottom: 0}}>
                        <Row nogutter>
                            { charPoolList.sort(dynamicSort("-level")).map(char => (
                                <Col xs={3} sm={3} md={3} lg={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={char.charId}>
                                    <CharacterPane 
                                    char={char}
                                    charInfo={characterList[char.charId]}
                                    weaponInfo={char.weaponId !== '' && weaponList.filter(v => v.id === char.weaponId)[0]}
                                    party0={party0}
                                    party1={party1}
                                    onClick={() => addCharToParty(char.charId, selectedPartyNumber)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={5} style={{minHeight: '90vh'}}>
                        <div>
                            <Element name="PARTIES" />
                            <PartyBox selected={selectedPartyNumber === 0 ? true : false } onClick={() => setSelectedPartyNumber(0)}>
                                <PartyNameColorIndicator partyNumber={0}>
                                    { partyMode === 1 ? t("PARTY_MAIN") : t("PARTY_FIRST_HALF")}
                                </PartyNameColorIndicator>
                                <Row nogutter>
                                    {party0.length !== 0 && party0.map((charId, index) => (
                                        <Col xs={3} sm={3} md={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={charId}>
                                            <CharacterPane 
                                            char={charPoolList.filter(v => v.charId === charId)[0]}
                                            charInfo={characterList[charId]}
                                            weaponInfo={charPoolList.filter(v => v.charId === charId)[0].weaponId !== '' //if it is not blank
                                                && weaponList.filter(v => v.id === charPoolList.filter(v => v.charId === charId)[0].weaponId)[0]}
                                            party0={party0}
                                            party1={party1}
                                            inParty={true}
                                            onClick={() => selectedPartyNumber === 0 ? addCharToParty(charId, selectedPartyNumber) : instaDeploy(charId)}
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </PartyBox>
                            <ChangePartyModeButton onClick={togglePartyMode}>
                                {t("CHANGE_PARTY_TYPE")}
                            </ChangePartyModeButton>
                            {
                                partyMode === 2 &&
                                <PartyBox selected={selectedPartyNumber === 1 ? true : false} onClick={() => setSelectedPartyNumber(1)}>
                                    <PartyNameColorIndicator partyNumber={1}>
                                        {t("PARTY_SECOND_HALF")}
                                    </PartyNameColorIndicator>
                                    <Row nogutter>
                                        {party1.length !== 0 && party1.map((charId, index) => (
                                            <Col xs={3} sm={3} md={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} key={charId}>
                                                <CharacterPane 
                                                char={charPoolList.filter(v => v.charId === charId)[0]}
                                                charInfo={characterList[charId]}
                                                weaponInfo={charPoolList.filter(v => v.charId === charId)[0].weaponId !== '' //if it is not blank
                                                    && weaponList.filter(v => v.id === charPoolList.filter(v => v.charId === charId)[0].weaponId)[0]}
                                                party0={party0}
                                                party1={party1}
                                                inParty={true}
                                                onClick={() => selectedPartyNumber === 1 ? addCharToParty(charId, selectedPartyNumber) : instaDeploy(charId)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                </PartyBox>
                            }
                            <CopyToClipboard 
                            text={createCurrentPartyString()} 
                            onCopy={() => alert.success(t("LINK_COPY_SUCCESS"))}
                            >
                                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, marginRight: 24, marginBottom: 24, cursor: 'pointer'}}>
                                    <img src="https://www.searchpng.com/wp-content/uploads/2019/02/Sgare-White-Icon-PNG.png" style={{width: 16, height: 16, marginRight: 8}} />
                                    {t("PARTY_SHARE_CURRENT_COMP")}
                                </div>
                            </CopyToClipboard>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                <CustomButton onClick={() => autoGenerateParty()}>
                                    {t("PARTY_AUTOGENERATE")}
                                </CustomButton>
                                <CustomButton onClick={() => disableButton ? alert.show('Loading...') : saveThisParty()}>
                                    {t("PARTY_SAVE")}
                                </CustomButton>
                            </div>
                            <div>
                                <div style={{fontSize: '1.2rem', margin: 8, marginTop: 16}}>
                                    {t("PARTY_SAVED_LIST")}
                                </div>
                                {
                                    savedPartyList.length === 0 &&
                                    <div style={{width: '100%', minHeight: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'lightgray'}}>
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
                                                    { v.shArray !== '' && v.shArray.split(',').map(Number).map(charId => 
                                                        <CharacterPaneMini charName={characterList[charId].name_en} key={charId} />
                                                    )}
                                                </Col>
                                                <Col xs={6} sm={6} md={4} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                                                    <img src="/images/likes.png" width={20} height={20} />
                                                    <span style={{color: '#cccccc'}}>{v.likes}</span>
                                                    <RecommendedPartyBoxButton onClick={() => applyFromRecommendedParty(v.fhArray, v.shArray)}>
                                                        Apply
                                                    </RecommendedPartyBoxButton>
                                                    <CopyToClipboard 
                                                    text={serverUrl + `/${i18n.language}/${partyUid}?p=${v.fhArray.replaceAll(',', '') + v.shArray.replaceAll(',', '')}`} 
                                                    onCopy={() => alert.success(t("LINK_COPY_SUCCESS"))}
                                                    >
                                                        <RecommendedPartyBoxButton>
                                                            Share
                                                        </RecommendedPartyBoxButton>
                                                    </CopyToClipboard>
                                                </Col>
                                            </Row>
                                        </div>
                                    </RecommendedPartyBox>
                                ))}
                                <Element name="ENDOFLIST" />
                            </div>
                        </div>
                    </Col>
                </>
            }
        </Row>
    )
}