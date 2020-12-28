import { useCallback, useState } from 'react'
import styled from 'styled-components'

const ConstellationBox = styled.span`
    color: ${props => props.isSelected ? 'gold' : 'white'};
    cursor: pointer;
    margin: 0px 6px;
`

const constellArray = [0, 1, 2, 3, 4, 5, 6]

export default function CharacterSetting( props: any ){

    const { 
        lang,
        character, 
        weapons,
        selectedCharsId,
        setSelectedCharsId,
        characterPool,
        setCharacterPool
    } = props

    const handleCharacterPool = useCallback(( clickedCharId ) => {
        if(selectedCharsId.includes(clickedCharId)){
            setSelectedCharsId(selectedCharsId.filter( v => v !== clickedCharId))
            setCharacterPool(characterPool.filter( v => v.charId !== clickedCharId))
        } else {
            setSelectedCharsId([...selectedCharsId, clickedCharId])
            setCharacterPool([...characterPool, { charId: clickedCharId, level: 0, constellation: 0, weaponId: 0 }])
        }
    },[selectedCharsId, characterPool])

    const handleLevel = useCallback(( charIdWillChangeLevel, levelParam ) => {
        setCharacterPool(characterPool.map(el => el.charId === charIdWillChangeLevel ? {...el, level: parseInt(levelParam)} : el))
    },[characterPool])

    const handleConstellation = useCallback(( charIdWillChangeLevel, constellParam ) => {
        setCharacterPool(characterPool.map(el => el.charId === charIdWillChangeLevel ? {...el, constellation: parseInt(constellParam)} : el))
    },[characterPool])

    const handleWeapon = useCallback(( charIdWillChangeLevel, weaponParam ) => {
        setCharacterPool(characterPool.map(el => el.charId === charIdWillChangeLevel ? {...el, weaponId: parseInt(weaponParam)} : el))
    },[characterPool])

    return(
        <div>
            <img src={`/images/characters/${character.name_en}.png`} width="40px" height="40px" style={{filter: selectedCharsId.includes(character.id) ? 'grayscale(0%)' : 'grayscale(100%)'}} onClick={() => handleCharacterPool(character.id)} />
            {character[`name_${lang}`]}
            {
                selectedCharsId.includes(character.id) &&
                <span>
                    lvl: <input style={{width: 40}} value={characterPool.filter(v => v.charId === character.id)[0].level} onChange={(e) => handleLevel(character.id, e.target.value)} />

                    C {constellArray.map(constell => 
                        <ConstellationBox 
                        key={constell} 
                        onClick={() => handleConstellation(character.id, constell)} 
                        isSelected={characterPool.filter(v => v.charId === character.id)[0].constellation === constell}>
                            {constell}
                        </ConstellationBox>
                    )}

                    <select name="weapon" id="weapon" onChange={(e) => handleWeapon(character.id, e.target.value)} value={characterPool.filter(v => v.charId === character.id)[0].weapon}>
                        {weapons.filter(v => character.weapon === v.type || v.type === 'none').map(v => <option value={v.id} >{v.name_en}</option>)}
                    </select>
                </span>
            }
        </div>
    )
}
