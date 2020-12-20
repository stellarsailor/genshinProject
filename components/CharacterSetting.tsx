import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { weapons } from '../datas/weaponList'

const ConstellationBox = styled.span`
    color: ${props => props.isSelected ? 'gold' : 'white'};
    cursor: pointer;
    margin: 0px 6px;
`

const constellArray = [0, 1, 2, 3, 4, 5, 6]

export default function CharacterSetting( props: any ){

    const { 
        character, 
        selectedChars,
        setSelectedChars,
        characterPool,
        setCharacterPool
    } = props

    const handleCharacterPool = useCallback(( clickedCharacterName ) => {
        if(selectedChars.includes(clickedCharacterName)){
            setSelectedChars(selectedChars.filter( v => v !== clickedCharacterName))
            setCharacterPool(characterPool.filter( v => v.name !== clickedCharacterName))
        } else {
            setSelectedChars([...selectedChars, clickedCharacterName])
            setCharacterPool([...characterPool, { name: clickedCharacterName, level: 0, constellation: 0, weapon: '' }])
        }
    },[selectedChars, characterPool])

    const handleLevel = useCallback(( charNameWillChangeLevel, levelParam ) => {
        setCharacterPool(characterPool.map(el => el.name === charNameWillChangeLevel ? {...el, level: parseInt(levelParam)} : el))
    },[characterPool])

    const handleConstellation = useCallback(( charNameWillChangeLevel, constellParam ) => {
        setCharacterPool(characterPool.map(el => el.name === charNameWillChangeLevel ? {...el, constellation: parseInt(constellParam)} : el))
    },[characterPool])

    const handleWeapon = useCallback(( charNameWillChangeLevel, weaponParam ) => {
        setCharacterPool(characterPool.map(el => el.name === charNameWillChangeLevel ? {...el, weapon: weaponParam} : el))
    },[characterPool])

    return(
        <div>
            <img src={`/images/characters/${character.name_en}.png`} width="40px" height="40px" style={{filter: selectedChars.includes(character.name_en) ? 'grayscale(0%)' : 'grayscale(100%)'}} onClick={() => handleCharacterPool(character.name_en)} />
            {character.name_en}
            {
                selectedChars.includes(character.name_en) &&
                <span>
                    lvl: <input style={{width: 40}} value={characterPool.filter(v => v.name === character.name_en)[0].level} onChange={(e) => handleLevel(character.name_en, e.target.value)} />

                    C {constellArray.map(constell => 
                        <ConstellationBox 
                        key={constell} 
                        onClick={() => handleConstellation(character.name_en, constell)} 
                        isSelected={characterPool.filter(v => v.name === character.name_en)[0].constellation === constell}>
                            {constell}
                        </ConstellationBox>
                    )}

                    <select name="weapon" id="weapon" onChange={(e) => handleWeapon(character.name_en, e.target.value)} value={characterPool.filter(v => v.name === character.name_en)[0].weapon}>
                        {weapons.filter(v => character.weapon === v.type).map(v => <option value={v.name_en} >{v.name_en}</option>)}
                    </select>
                </span>
            }
        </div>
    )
}
