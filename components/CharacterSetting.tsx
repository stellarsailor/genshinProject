import { useCallback, useState } from 'react'
import { Col, Row } from 'react-grid-system'
import styled from 'styled-components'
import { useTranslation } from '../i18n'
import FirstLetterToLower from '../logics/FirstLetterToLower'

type selectedType = {
    isSelected: boolean;
}
const ConstellationBox = styled("span")<selectedType>`
    color: ${props => props.isSelected ? 'gold' : 'gray'};
    font-weight: ${props => props.isSelected ? 'bold' : 'normal'};
    cursor: pointer;
    padding: 0px 4px;
`

const constellArray = [0, 1, 2, 3, 4, 5, 6]

export default function CharacterSetting( props: any ){
    const { t, i18n } = useTranslation()

    const { 
        lang,
        character, 
        weapons,
        selectedCharsId,
        setSelectedCharsId,
        characterPool,
        setCharacterPool
    } = props

    const [ includeWeapon, setIncludeWeapon ] = useState(false)

    const handleCharacterPool = useCallback(( clickedCharId ) => {
        if(selectedCharsId.includes(clickedCharId)){
            setSelectedCharsId(selectedCharsId.filter( v => v !== clickedCharId))
            setCharacterPool(characterPool.filter( v => v.charId !== clickedCharId))
        } else {
            setSelectedCharsId([...selectedCharsId, clickedCharId])
            setCharacterPool([...characterPool, { charId: clickedCharId, level: 1, constellation: 0, weaponId: '' }])
        }
    },[selectedCharsId, characterPool])

    const handleLevel = useCallback(( charIdWillChangeLevel, levelParam ) => {
        if(levelParam === '') setCharacterPool(characterPool.map(el => el.charId === charIdWillChangeLevel ? {...el, level: (levelParam)} : el))
        else setCharacterPool(characterPool.map(el => el.charId === charIdWillChangeLevel ? {...el, level: parseInt(levelParam)} : el))
    },[characterPool])

    const handleConstellation = useCallback(( charIdWillChangeLevel, constellParam ) => {
        setCharacterPool(characterPool.map(el => el.charId === charIdWillChangeLevel ? {...el, constellation: parseInt(constellParam)} : el))
    },[characterPool])

    const handleWeapon = useCallback(( charIdWillChangeLevel, weaponParam ) => {
        let param
        if(weaponParam === '') param = ''
        else param = parseInt(weaponParam)
        setCharacterPool(characterPool.map(el => el.charId === charIdWillChangeLevel ? {...el, weaponId: param} : el))
    },[characterPool])

    return(
        <Row nogutter 
        style={{marginBottom: 8, backgroundColor: selectedCharsId.includes(character.id) ? '#121420' : 'rgb(34, 36, 48)', padding: 8, borderRadius: 5}}>
            <Col md={12}>
                <span onClick={() => handleCharacterPool(character.id)} style={{cursor: 'pointer'}}>
                    {character[`name_${lang}`]}
                </span>
            </Col>
            <Col md={12} style={{display: 'flex', flexDirection: 'row'}}>
                <img 
                src={`/images/characters/${FirstLetterToLower(character.name_en)}.png`} 
                width="40px" 
                height="40px" 
                style={{cursor: 'pointer', filter: selectedCharsId.includes(character.id) ? 'grayscale(0%)' : 'grayscale(100%)'}} onClick={() => handleCharacterPool(character.id)} 
                />
                {
                    selectedCharsId.includes(character.id) &&
                    <span style={{marginLeft: 16}}>
                        <div style={{marginBottom: 4}}>
                        Lv. <input 
                        type="number"
                        min={1}
                        max={90}
                        step={10}
                        style={{width: 50, marginRight: 24}} 
                        value={characterPool.filter(v => v.charId === character.id)[0].level} 
                        onChange={(e) => handleLevel(character.id, e.target.value)} />

                        {i18n.language === 'en' && 'C' } 
                        {constellArray.map(constell => 
                            <ConstellationBox 
                            key={constell} 
                            onClick={() => handleConstellation(character.id, constell)} 
                            isSelected={characterPool.filter(v => v.charId === character.id)[0].constellation === constell}>
                                {constell}
                            </ConstellationBox>
                        )}
                        {i18n.language === 'ko' && '돌' } 
                        </div>
                        <div>
                            Weapon
                            <input type="checkbox" 
                            checked={includeWeapon} 
                            onChange={(e) => { 
                                // console.log(e.target.checked)
                                if(!e.target.checked) { 
                                    handleWeapon(character.id, '')
                                    setIncludeWeapon(e.target.checked)
                                } else {
                                    handleWeapon(character.id, 0)
                                    setIncludeWeapon(e.target.checked)
                                }
                            }} 
                            style={{marginRight: '1rem'}} />
                            {
                                includeWeapon &&
                                <>
                                    <select 
                                    name="weapon" 
                                    id="weapon" 
                                    onChange={(e) => handleWeapon(character.id, e.target.value)} 
                                    // value={characterPool.filter(v => v.charId === character.id)[0].weapon}
                                    >
                                        {weapons.filter(v => character.weapon === v.type || v.type === 'none').map((v, index) => (
                                            <option value={v.id} key={index}>
                                                {v[`name_${i18n.languages}`]}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            }
                        </div>
                    </span>
                }
            </Col>
        </Row>
    )
}
