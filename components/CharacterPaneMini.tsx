import styled from 'styled-components'
import FirstLetterToLower from '../logics/FirstLetterToLower'

const Pane = styled.div`
    border: 1px solid #222430; 
    border-radius: 5px;
    width: 30px; 
    height: 30px; 
    margin-right: 3px;
    background-color: darkgray;
`

export default function CharacterPaneMini(props) {

    const { charName } = props

    return(
        <Pane>
            <img src={`/images/characters/${FirstLetterToLower(charName)}.png`} style={{width: '100%', height: '100%'}} />
        </Pane>
    )
}