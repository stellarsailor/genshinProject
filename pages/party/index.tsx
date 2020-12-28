import { useCallback, useState } from 'react'
import { useTranslation, Router, Link } from '../../i18n';
import styled from 'styled-components'
import CharacterPane from '../../components/CharacterPane'
import CharacterSetting from '../../components/CharacterSetting'
// import { characters } from '../../datas/characterList'
import { serverUrl } from '../../lib/serverUrl'

export default function PartyMakePage(props) {
    const { t, i18n } = useTranslation()
    const [ selectedCharsId, setSelectedCharsId ] = useState<Array<number>>([])
    const [ characterPool, setCharacterPool ] = useState<Array<any>>([])

    const characterList = props.assets.length === 0 ? [] : props.assets.characters
    const weaponList = props.assets.length === 0 ? [] : props.assets.weapons

    const submitCharacterPool = useCallback( async () => {
        let url = `${serverUrl}/api/pools`

        const settings = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
    },[characterPool])

    return(
        <div>
            <div>
                {t("MESSAGE_MAKE_CHARACTERPOOL")}
            </div>
            {characterList.map(character => (
                <CharacterSetting 
                lang={i18n.language}
                character={character}
                weapons={weaponList}
                selectedCharsId={selectedCharsId}
                setSelectedCharsId={setSelectedCharsId}
                characterPool={characterPool}
                setCharacterPool={setCharacterPool}
                />
            ))}

            <input type="button" value="submit" onClick={submitCharacterPool} />

        </div>
    )
}