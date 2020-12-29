import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Col, Row } from 'react-grid-system'
import CharacterPane from '../components/CharacterPane'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styled from 'styled-components'
import { serverUrl } from '../lib/serverUrl'
import { useTranslation } from '../i18n'
import dynamicSort from '../logics/dynamicSort'
import makeCompString from '../logics/makeCompString'
import CharacterPaneMini from '../components/CharacterPaneMini'

type charPoolType = {
    level: number;
    charId: number;
    weaponId: number | '';
    constellation: number;
}

type recommendedPartyType = {
    id: number;
    compString: string;
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
    c6: number;
    c7: number;
    c8: number;
    likes: number;
}

type selectedType = {
    selected: boolean;
}
const PartyBox = styled("div")<selectedType>`
    width: 100%;
    min-height: 160px;
    background-color: #49556d;
    border: ${props => props.selected ? '2px solid white' : '2px solid rgba(0,0,0,0)' };
    padding: 5px;
    margin: 16px 0px;
    border-radius: 5px;
    z-index: 0;
    cursor: pointer;
`

const RecommendedPartyBox = styled.div`
    background-color: #272937;
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

    const characterList = props.assets.length === 0 ? [] : props.assets.characters
    const weaponList = props.assets.length === 0 ? [] : props.assets.weapons

    const [ charPoolList, setCharPoolList ] = useState<Array<charPoolType>>([])
    const [ recommendedPartyList, setRecommendedPartyList ] = useState<Array<recommendedPartyType>>([])
    // const [ sortBy, setSortBy ] = useState('level') // level, stars, name, constellation

    const [ selectedPartyNumber, setSelectedPartyNumber ] = useState<number>(0)
    const [ party0, setParty0 ] = useState<Array<number>>([])
    const [ party1, setParty1 ] = useState<Array<number>>([])

    async function fetchPool() {
        
        let url = `${serverUrl}/api/pools?uid=${partyUid}`
    
        const res = await fetch(url)
        const data = await res.json()
        
        setCharPoolList(JSON.parse(data.pool.list))
        setRecommendedPartyList(data.recommendedParty)
    }
    
    useEffect(() => {
        if(router.query.p){
            let compString = router.query.p

            let party0premade = []
            let party1premade = []
            for (var i = 0, charsLength = compString.length; i < charsLength; i += 2) {
                let charId = parseInt(compString.substring(i, i + 2))
                if(i <= 6) party0premade.push(charId)
                else party1premade.push(charId)
            }
            setParty0(party0premade)
            setParty1(party1premade)
        }
        fetchPool()
    },[])

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

    const saveThisParty = useCallback( async () => {
        if(party0.length !== 4 || party1.length !== 4){
            return 0
        }
        console.log(party0)
        console.log(party1)
        let partyCompArray = party0.concat(party1)

        let url = `${serverUrl}/api/pools`

        const settings = {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: partyUid,
                partyCompString: makeCompString(partyCompArray),
                partyCompArray: partyCompArray,
            })
        }
        try {
            const fetchResponse = await fetch(url, settings)
            const data = await fetchResponse.json()

            console.log(data)
            fetchPool()
        } catch (e) {
            return e;
        }
    },[ party0, party1 ])

    const applyFromRecommendedParty = (compString) => {
        let party0premade = []
        let party1premade = []
        for (var i = 0, charsLength = compString.length; i < charsLength; i += 2) {
            let charId = parseInt(compString.substring(i, i + 2))
            if(i <= 6) party0premade.push(charId)
            else party1premade.push(charId)
        }
        setParty0(party0premade)
        setParty1(party1premade)
    }

    return(
        <Row nogutter justify="center">
            {
                (charPoolList.length === 0 || characterList.length === 0 || weaponList.length === 0) 
                ?
                <div>Loading...</div>
                :
                <>
                    <div>
                        3. 파티 구성 (여기서 레벨별, 레어도별 필터가능 / 자동추천 기능 - 1번 캐릭을 선택해야만 추천됨 / 링크공유하기 기능 - 받은사람은 바로 3번탭부터 / 캡쳐 기능)
                        
                        <CopyToClipboard text={serverUrl + router.asPath}
                        onCopy={() => console.log('success')}>
                            <span style={{width: '100%'}}>
                                {t("PLAYPAGE_SHARE")}
                            </span>
                        </CopyToClipboard>
                    </div>
                    <Col xs={12} sm={12} md={12} lg={7} style={{padding: '1rem'}}>
                        <Row nogutter>
                            { charPoolList.sort(dynamicSort("-level")).map(char => (
                                <Col xs={3} sm={3} md={3} lg={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                    <Col xs={12} sm={12} md={12} lg={5} style={{padding: '1rem'}}>
                        <PartyBox selected={selectedPartyNumber === 0 ? true : false } onClick={() => setSelectedPartyNumber(0)}>
                            전반
                            <Row nogutter>
                                {party0.length !== 0 && party0.map((charId, index) => (
                                    <Col xs={3} sm={3} md={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                            후반
                            <Row nogutter>
                                {party1.length !== 0 && party1.map((charId, index) => (
                                    <Col xs={3} sm={3} md={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
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
                        <div>
                            Auto generate(preparing)
                        </div>
                        <div onClick={() => saveThisParty()}>
                            Save Party
                        </div>
                        <div style={{backgroundColor: '#222431'}}>
                            Saved Party List
                                {recommendedPartyList.map((v, index) => (
                                    <RecommendedPartyBox>
                                        <div style={{display: 'flex', flexDirection: 'row'}}>
                                            <CharacterPaneMini charName={characterList[v.c1].name_en} />
                                            <CharacterPaneMini charName={characterList[v.c2].name_en} />
                                            <CharacterPaneMini charName={characterList[v.c3].name_en} />
                                            <CharacterPaneMini charName={characterList[v.c4].name_en} />
                                            <div style={{marginRight: 16}} />
                                            <CharacterPaneMini charName={characterList[v.c5].name_en} />
                                            <CharacterPaneMini charName={characterList[v.c6].name_en} />
                                            <CharacterPaneMini charName={characterList[v.c7].name_en} />
                                            <CharacterPaneMini charName={characterList[v.c8].name_en} />
                                            <RecommendedPartyBoxButton onClick={() => applyFromRecommendedParty(v.compString)}>
                                                Apply
                                            </RecommendedPartyBoxButton>
                                            <CopyToClipboard text={serverUrl + `/${i18n.language}/${partyUid}?p=${v.compString}`} onCopy={() => console.log('success')}>
                                                <RecommendedPartyBoxButton>
                                                    Share
                                                </RecommendedPartyBoxButton>
                                            </CopyToClipboard>
                                            + {v.likes}
                                        </div>
                                    </RecommendedPartyBox>
                                ))}
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