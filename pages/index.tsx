import { useState } from 'react'
import styled from 'styled-components'
import CharacterPane from '../components/CharacterPane'
import CharacterSetting from '../components/CharacterSetting'
import { characters } from '../datas/characterList'

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`

export default function Home() {

  const [ selectedChars, setSelectedChars ] = useState<Array<string>>([])
  const [ characterPool, setCharacterPool ] = useState<Array<any>>([])

  return (
    <>
      <Title>
        Genshin Party Helper
      </Title>
      <div>
        1. 먼저 보유한 캐릭터들을 선택해주세요. (흑백 캐릭 리스트, 속성과 이름만 출력 -> 선택시 흑백캐릭은 사라짐) 별자리 돌파와 레벨, 무기(선택사항)를 채워넣어주세요. 
      </div>
      {characters.map(character => (
        <CharacterSetting 
          character={character}
          selectedChars={selectedChars}
          setSelectedChars={setSelectedChars}
          characterPool={characterPool}
          setCharacterPool={setCharacterPool}
        />
      ))}
      <input type="button" value="submit" onClick={() => console.log(characterPool)} />
      <div>
        3. 파티 구성 (여기서 레벨별, 레어도별 필터가능 / 자동추천 기능 - 1번 캐릭을 선택해야만 추천됨 / 링크공유하기 기능 - 받은사람은 바로 3번탭부터 / 캡쳐 기능)
      </div>
      {characters.map(character => (
        <CharacterPane 
        character={character}
        charLevel={80}
        constellation={3}
        isClicked={true}
        />
      ))}
    </>
  )
}
