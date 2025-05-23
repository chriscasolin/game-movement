import styled from "styled-components"

const Background = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.6);
`

const Content = styled.div`
  height: 80%;
  width: 80%;

  border-radius: 5px;
  border: 0.2rem solid black;
  background-color: rgba(200, 200, 200, 0.7)
`

const Dialogue = ({ children }) => {
  return (
    <Background>
      <Content>
        {children}
      </Content>
    </Background>
  )
}

export default Dialogue;