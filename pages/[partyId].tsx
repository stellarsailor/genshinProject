import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Col, Row } from 'react-grid-system'
import CharacterPane from '../components/CharacterPane'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import styled from 'styled-components'
import { serverUrl } from '../lib/serverUrl'
import { useTranslation } from '../i18n'

type charPoolType = {
    level: number;
    charId: number;
    weaponId: number;
    constellation: number;
}

type selectedType = {
    selected: boolean;
}
const PartyBox = styled("div")<selectedType>`
    width: 100%;
    background-color: #59657d;
    border: ${props => props.selected ? '2px solid white' : 'none' };
    padding: 5px;
    border-radius: 5px;
    z-index: 0;
`

export default function PartyDetail(props) {
    const router = useRouter()
    const { t, i18n } = useTranslation()
    const { partyId } = router.query

    const characterList = props.assets.length === 0 ? [] : props.assets.characters
    const weaponList = props.assets.length === 0 ? [] : props.assets.weapons

    const [ charPoolList, setCharPoolList ] = useState<Array<charPoolType>>([])

    const [ selectedPartyNumber, setSelectedPartyNumber ] = useState<number>(0)
    const [ party0, setParty0 ] = useState<Array<number>>([])
    const [ party1, setParty1 ] = useState<Array<number>>([])

    useEffect(() => {
        async function fetchPool() {

            let url = `${serverUrl}/api/pools?uid=${partyId}`
        
            const res = await fetch(url)
            const data = await res.json()
            
            setCharPoolList(JSON.parse(data.pool.list))
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

    return(
        <Row nogutter justify="center">
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
                    { charPoolList.length !== 0 && characterList.length !== 0 && weaponList.length !== 0 
                    && charPoolList.map(char => (
                        <Col xs={3} sm={3} md={3} onClick={() => addCharToParty(char.charId, selectedPartyNumber)}>
                            <CharacterPane 
                            char={char}
                            charInfo={characterList[char.charId]}
                            weaponInfo={weaponList[char.weaponId]}
                            party0={party0}
                            party1={party1}
                            />
                        </Col>
                    ))}
                </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={5} style={{padding: '1rem'}}>
                <PartyBox selected={selectedPartyNumber === 0 ? true : false } onClick={() => setSelectedPartyNumber(0)}>
                    전반
                    <Row nogutter>
                        {party0.map((charId, index) => (
                            <Col xs={3} sm={3} md={3} onClick={() => selectedPartyNumber === 0 ? addCharToParty(charId, selectedPartyNumber) : instaDeploy(charId)}>
                                <CharacterPane 
                                char={charPoolList.filter(v => v.charId === charId)[0]}
                                charInfo={characterList[charId]}
                                weaponInfo={weaponList[charPoolList.filter(v => v.charId === charId)[0].weaponId]}
                                party0={party0}
                                party1={party1}
                                inParty={true}
                                />
                            </Col>
                        ))}
                    </Row>
                </PartyBox>
                <PartyBox selected={selectedPartyNumber === 1 ? true : false} onClick={() => setSelectedPartyNumber(1)}>
                    후반
                    <Row nogutter>
                        {party1.map((charId, index) => (
                            <Col xs={3} sm={3} md={3} onClick={() => selectedPartyNumber === 1 ? addCharToParty(charId, selectedPartyNumber) : instaDeploy(charId)}>
                                <CharacterPane 
                                char={charPoolList.filter(v => v.charId === charId)[0]}
                                charInfo={characterList[charId]}
                                weaponInfo={weaponList[charPoolList.filter(v => v.charId === charId)[0].weaponId]}
                                party0={party0}
                                party1={party1}
                                inParty={true}
                                />
                            </Col>
                        ))}
                    </Row>
                </PartyBox>
                <div>
                    Auto generate(preparing)
                </div>
                <div>
                    Complete Party
                </div>
            </Col>
        </Row>
    )
}

// export async function getServerSideProps({ params, req }) {

    // let url = `${serverUrl}/api/bingos/${params.bingoId}`

    // const res = await fetch(url)
    // const data = await res.json()

    // return { props: { data } }
// }