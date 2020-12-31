import { useCallback, useState } from 'react'
import { useTranslation, Router, Link } from '../../i18n';
import styled from 'styled-components'
import CharacterPane from '../../components/CharacterPane'
import CharacterSetting from '../../components/CharacterSetting'
import { useAlert } from 'react-alert'
import { serverUrl } from '../../lib/serverUrl'
import { Col, Row } from 'react-grid-system';

const CustomButton = styled.div`
    width: 200px;
    height: 55px;
    margin-top: 2rem;
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

export default function PartyMakePage(props) {
    const { t, i18n } = useTranslation()
    const alert = useAlert()

    const [ submitLoading, setSubmitLoading ] = useState(false)
    const [ titleInput, setTitleInput ] = useState<string>('')

    const [ selectedCharsId, setSelectedCharsId ] = useState<Array<number>>([])
    const [ characterPool, setCharacterPool ] = useState<Array<any>>([])

    const characterList = props.assets.length === 0 ? [] : props.assets.characters
    const weaponList = props.assets.length === 0 ? [] : props.assets.weapons

    const submitCharacterPool = useCallback( async () => {
        let levelException = false
        let noneException = false

        if(characterPool.length === 0) noneException = true
        characterPool.map(v => {
            if(v.level < 1 || 90 < v.level) levelException = true
        })

        if(levelException){
            alert.error(t("CREATE_PARTY_LEVEL_ERROR"))
        } else if (noneException){
            alert.error(t("CREATE_PARTY_NONE_ERROR"))
        } else {
            setSubmitLoading(true)
            let url = `${serverUrl}/api/pools`
    
            const settings = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: titleInput,
                    characterPool: characterPool,
                })
            }
            try {
                const fetchResponse = await fetch(url, settings)
                const data = await fetchResponse.json()
    
                Router.push(`/${data.redirectUID}`)
            } catch (e) {
                return e;
            }
        }

    },[ titleInput, characterPool ])

    return(
        <Row nogutter justify="center" >
            <Col xs={12} sm={8} md={6} style={{backgroundColor: '#222430', padding: '1rem', margin: '1rem 0px'}}>
                <div style={{marginBottom: 24}}>
                    <div style={{fontSize: '1.3rem'}}>
                        {t('MY_PARTY_TITLE')}   
                    </div>
                    <small>
                        {t("MY_PARTY_TITLE_EXAMPLE")}
                    </small>
                    <input style={{width: '100%', height: 35, borderRadius: 8}} value={titleInput} onChange={e => setTitleInput(e.target.value)} />
                </div>
                <div style={{margin: '2rem 0px', fontSize: 18, borderLeft: '3px solid #c0ff3f', paddingLeft: 8}}>
                    {t("MESSAGE_MAKE_CHARACTERPOOL")}
                </div>
                {characterList.map((character, index) => (
                    <CharacterSetting 
                    key={index}
                    lang={i18n.language}
                    character={character}
                    weapons={weaponList}
                    selectedCharsId={selectedCharsId}
                    setSelectedCharsId={setSelectedCharsId}
                    characterPool={characterPool}
                    setCharacterPool={setCharacterPool}
                    />
                ))}

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <CustomButton onClick={submitCharacterPool} style={{pointerEvents: submitLoading ? "none" : 'all'}}>
                        {t("CREATE_MY_PARTY")}
                    </CustomButton>
                </div>
            </Col>
        </Row>
    )
}