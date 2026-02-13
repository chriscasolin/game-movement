import React from "react"
import styled from "styled-components"

const ControlLine = styled.p`
    font-size: 0.7em;
`

const ControlsContent = styled.div`
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
`

const Separator = styled.span`
    font-size: 0.5em;
    color: #aaa;
    padding: 0 5px;
`

const controlsStrings = [
    "Use the Arrow Keys to move",
    "Stay still: s",
    "Strafe: Shift",
    "Break: c",
    "Interact: x",
    "Inventory: d",
    "Change Target Distance: a"
]

const Info = () => {
    return (
        <Info.Container>
            <ControlsContent>
                {/* add a separator between the controls, but not after the last one */}
                {controlsStrings.map((str, i) => (
                    <React.Fragment key={i}>
                        <ControlLine>{str}</ControlLine>
                        {i < controlsStrings.length - 1 && <Separator>|</Separator>}
                    </React.Fragment>
                ))}
            </ControlsContent>
        </Info.Container>
    )
}

Info.Container = styled.div`
    position: relative;
    width: 50%;
    margin: 0 auto;
    color: #eee;
    background-color: #333;
    padding: 10px;
    border-radius: 5px;
`

export default Info;